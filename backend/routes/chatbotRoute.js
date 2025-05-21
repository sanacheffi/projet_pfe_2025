const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Ollama } = require("@langchain/community/llms/ollama");

const llama = new Ollama({
  model: "llama3",
  baseUrl: "http://localhost:11434"
});

// ✅ Get list of collections from DB
async function getCollections() {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name);
  } catch (error) {
    console.error("Erreur lors de la récupération des collections:", error);
    return [];
  }
}

// ✅ Try to extract valid JSON from possibly malformed LLaMA output
function extractJSON(text) {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("Aucun JSON trouvé");

    let jsonStr = text.substring(start, end + 1);

    // ✅ Fix common issues like trailing commas
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erreur lors de l'extraction du JSON:", error);
    return null;
  }
}

// ✅ Sanitize AI-generated queries to remove unsupported $elemMatch for string fields
function sanitizeQuery(query) {
  if (Array.isArray(query)) {
    // Aggregation pipeline
    return query.map(stage => {
      if (stage.$match) {
        const newMatch = {};
        for (const [key, value] of Object.entries(stage.$match)) {
          if (value && typeof value === 'object' && '$elemMatch' in value) {
            const elemMatchValue = value.$elemMatch;
            if (elemMatchValue && typeof elemMatchValue === 'object' && ('$regex' in elemMatchValue)) {
              newMatch[key] = new RegExp(elemMatchValue.$regex, elemMatchValue.$options || '');
            } else {
              newMatch[key] = elemMatchValue;
            }
          } else {
            newMatch[key] = value;
          }
        }
        return {
          ...stage,
          $match: newMatch
        };
      }
      return stage;
    });
  } else if (query && typeof query === 'object') {
    // Simple find query
    const newQuery = {};
    for (const [key, value] of Object.entries(query)) {
      if (value && typeof value === 'object' && '$elemMatch' in value) {
        const elemMatchValue = value.$elemMatch;
        if (elemMatchValue && typeof elemMatchValue === 'object' && ('$regex' in elemMatchValue)) {
          newQuery[key] = new RegExp(elemMatchValue.$regex, elemMatchValue.$options || '');
        } else {
          newQuery[key] = elemMatchValue;
        }
      } else {
        newQuery[key] = value;
      }
    }
    return newQuery;
  }
  return query;
}

// ✅ Analyze user's question and get intent + MongoDB query
async function analyzeIntent(userQuestion) {
  const availableCollections = await getCollections();
  console.log("Collections disponibles:", availableCollections);

  const prompt = `
Tu es un assistant qui analyse des questions en français et génère des requêtes MongoDB appropriées.

Les collections disponibles dans la base de données sont : ${availableCollections.join(', ')}.

Correspondances des champs :
- nom = name
- prix = price
- catégorie = category
- produit = product
- description = description

Réponds UNIQUEMENT avec un objet JSON valide :
{
  "intent": "list|search|aggregate",
  "collection": "nom_de_la_collection",
  "query": {}
}

Exemple pour le produit le plus cher :
{
  "intent": "aggregate",
  "collection": "products",
  "query": [
    { "$sort": { "price": -1 } },
    { "$limit": 1 }
  ]
}

Question : ${userQuestion}
  `;

  try {
    const response = await llama.call(prompt);
    console.log("Réponse brute du modèle:", response);

    const analysis = extractJSON(response);

    if (!analysis || !analysis.collection || !availableCollections.includes(analysis.collection)) {
      console.warn(`❌ Collection invalide ou manquante : ${analysis?.collection}`);
      return {
        intent: "list",
        collection: "products", // ✅ Default to products if available
        query: {}
      };
    }

    return analysis;
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    return {
      intent: "list",
      collection: "products",
      query: {}
    };
  }
}

// ✅ Generate user-facing response in French
async function generateResponse(data, userQuestion) {
  const prompt = `
Question de l'utilisateur : ${userQuestion}
Données trouvées (${data.length} résultats) : ${JSON.stringify(data)}

Génère une réponse naturelle en français basée sur ces données.

- Si aucune donnée n'est trouvée, indique-le poliment.
- Si plusieurs éléments sont trouvés, fais-en un résumé clair.
- Réponds en français.
- Sois concis mais informatif.
`;

  try {
    const response = await llama.call(prompt);
    return response.trim();
  } catch (error) {
    console.error("Erreur lors de la génération de réponse:", error);
    return "Désolé, je n'ai pas pu générer une réponse appropriée.";
  }
}

//  chatbot route
router.post('/', async (req, res) => {
  try {
    const userQuestion = req.body.question;
    if (!userQuestion) {
      return res.status(400).json({ success: false, error: 'La question est requise' });
    }

    console.log("Question reçue:", userQuestion);
    const analysis = await analyzeIntent(userQuestion);
    console.log("Analyse finale:", analysis);

    // Make category query case-insensitive for aggregate and find
    if (Array.isArray(analysis.query)) {
      analysis.query = analysis.query.map(stage => {
        if (stage.$match && typeof stage.$match.category === 'string') {
          return {
            ...stage,
            $match: {
              ...stage.$match,
              category: new RegExp(`^${stage.$match.category}$`, 'i')
            }
          };
        }
        return stage;
      });
    } else if (analysis.query && typeof analysis.query.category === 'string') {
      analysis.query.category = new RegExp(`^${analysis.query.category}$`, 'i');
    }

    // Sanitize query to remove unsupported $elemMatch operators before MongoDB call
    const sanitizedQuery = sanitizeQuery(analysis.query);

    let data;
    if (analysis.intent === 'aggregate') {
      data = await mongoose.connection.db.collection(analysis.collection).aggregate(sanitizedQuery).toArray();
    } else {
      data = await mongoose.connection.db.collection(analysis.collection).find(sanitizedQuery).toArray();
    }

    console.log(`${data.length} résultats trouvés dans ${analysis.collection}`);
    const response = await generateResponse(data, userQuestion);

    res.json({
      success: true,
      response,
      debug: {
        intent: analysis.intent,
        collection: analysis.collection,
        query: sanitizedQuery,
        resultCount: data.length
      }
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors du traitement.",
      details: error.message
    });
  }
});

module.exports = router;
