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
  const allowed = ['products', 'categories', 'subcategories'];
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name).filter(name => allowed.includes(name));
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
- sous-catégorie = subCategory
- produit = product
- description = description
- date = createdAt ou date (si existant)

Réponds UNIQUEMENT avec un objet JSON valide, sans explication, sans introduction.

Voici des exemples de questions et les réponses attendues :

1. Question : Quel est le produit le plus cher ?
Réponse :
{
  "intent": "aggregate",
  "collection": "products",
  "query": [
    { "$sort": { "price": -1 } },
    { "$limit": 1 }
  ]
}

2. Question : Quel est le produit le moins cher ?
Réponse :
{
  "intent": "aggregate",
  "collection": "products",
  "query": [
    { "$sort": { "price": 1 } },
    { "$limit": 1 }
  ]
}

3. Question : Montre-moi les produits à moins de 20 dinars
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "price": { "$lt": 20 }
  }
}

4. Question : Quels sont les produits à plus de 50 dinars?
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "price": { "$gt": 50 }
  }
}

5. Question : Donne-moi les produits entre 30 et 60 dinars
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "price": { "$gte": 30, "$lte": 60 }
  }
}

6. Question : Donne-moi les produits de la catégorie meubles
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "category": "Meubles Rotin"
  }
}

7. Question : Produits de la sous-catégorie chaises
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "subCategory": "chaises"
  }
}

8. Question : Montre-moi les chaises disponible
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "name": { "$regex": "Chaise", "$options": "i" }
  }
}


9. Question : Donne-moi les produits de la catégorie luminaires à moins de 100 dinars
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "category": "luminaires",
    "price": { "$lt": 100 }
  }
}

10. Question : Liste tous les produits
Réponse :
{
  "intent": "list",
  "collection": "products",
  "query": {}
}

Maintenant, traite la question suivante :

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
- Affiche les prix en dinars tunisiens (TND).
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

// ✅ Main chatbot route
router.post('/', async (req, res) => {
  try {
    const userQuestion = req.body.question;
    if (!userQuestion) {
      return res.status(400).json({ success: false, error: 'La question est requise' });
    }

    console.log("Question reçue:", userQuestion);
    const analysis = await analyzeIntent(userQuestion);
    console.log("Analyse finale:", analysis);

    let data;
    // ✅ Convert category/subCategory to case-insensitive regex
if (analysis.intent === 'search' && analysis.query) {
  if (analysis.query.category && typeof analysis.query.category === 'string') {
    analysis.query.category = new RegExp(`^${analysis.query.category}$`, 'i');
  }
  if (analysis.query.subCategory && typeof analysis.query.subCategory === 'string') {
    analysis.query.subCategory = new RegExp(`^${analysis.query.subCategory}$`, 'i');
  }
}

if (analysis.intent === 'aggregate') {
  data = await mongoose.connection.db.collection(analysis.collection).aggregate(analysis.query).toArray();
} else {
  data = await mongoose.connection.db.collection(analysis.collection).find(analysis.query).toArray();
}


    console.log(`${data.length} résultats trouvés dans ${analysis.collection}`);
    const response = await generateResponse(data, userQuestion);

    res.json({
      success: true,
      response,
      debug: {
        intent: analysis.intent,
        collection: analysis.collection,
        query: analysis.query,
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
