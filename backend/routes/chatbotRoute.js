const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Ollama } = require("@langchain/community/llms/ollama");
const JSON5 = require('json5');

const llama = new Ollama({
  model: "llama3",
  baseUrl: "http://localhost:11434"
});

// Get list of collections from DB
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

// Try to extract valid JSON from possibly malformed LLaMA output
function extractJSON(text) {
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    let jsonString = text.slice(start, end + 1);

    // (Optional) Auto‑balance braces if still unbalanced:
    const opens  = (jsonString.match(/\{/g) || []).length;
    const closes = (jsonString.match(/\}/g) || []).length;
    if (opens > closes) {
      jsonString += '}'.repeat(opens - closes);
    }

    try {
      return JSON5.parse(jsonString);
    } catch (err) {
      console.error("Erreur JSON5.parse :", err.message);
      return null;
    }
  }
  return null;
}


// Analyze user's question and get intent + MongoDB query
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

Réponds UNIQUEMENT avec un objet JSON valide, sur UNE SEULE LIGNE, sans retour à la ligne ni espaces inutiles, sans explication.
Aucune virgule finale autorisée.
N’oublie pas de fermer toutes les accolades. Ton JSON doit commencer par { et se terminer par }.

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

4. Question : Quels sont les produits à plus de 50 dinars ?
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

6. Question : Donne-moi les produits de la catégorie Meubles Rotin
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

8. Question : Montre-moi les chaises disponibles
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

11. Question : Montre-moi les produits en stock
Réponse :
{
  "intent": "search",
  "collection": "products",
  "query": {
    "countInStock": { "$gt": 0 }
  }
}

12. Question : Donne-moi les catégories disponibles
Réponse :
{
  "intent": "distinct",
  "collection": "products",
  "field": "category"
}

13. Question : Quelle est l’histoire de l’entreprise ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Artisanat Cheffi est une entreprise familiale fondée dans les années 70, dédiée à la vannerie. Elle se spécialise dans le tressage de fibres naturelles pour fabriquer aussi bien des objets du quotidien que des pièces artistiques."
  }
}

14. Question : Comment puis‑je vous contacter ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Vous pouvez nous joindre par email à artisanatcheffi@gmail.com ou par téléphone au +216 97 202 577."
  }
}

15. Question : Quels sont vos horaires de disponibilité ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Nous n’avons pas de boutique physique, mais vous pouvez passer commande à tout moment sur notre site en ligne. Nous répondons à vos messages du lundi au samedi, de 8h00 à 17h00."
  }
}


16. Question : Où est située votre boutique ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Actuellement, Artisanat Cheffi ne possède pas de point de vente physique. Les produits sont uniquement commercialisés en ligne sur ce site."
  }
}

17. Question : Quelle est votre politique de livraison ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Nous livrons dans toute la Tunisie en 3 à 5 jours ouvrables. La livraison est gratuite."
  }
}

18. Question : Quelle est votre politique de retour ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Vous pouvez retourner tout article dans un délai de 14 jours après réception, à condition qu’il soit en parfait état et dans son emballage d’origine."
  }
}

19. Question : Quels moyens de paiement acceptez‑vous ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Nous acceptons les paiements par carte de crédit (Visa, MasterCard) et paiement à la livraison."
  }
}

20. Question : Avez‑vous une garantie sur vos produits ?
Réponse :
{
  "intent": "static",
  "response": {
    "text": "Tous nos produits bénéficient d’une garantie de 2 ans contre tout vice de fabrication."
  }
}

21. Question : Bonjour
Réponse :
{ "intent": "static", "response": { "text": "Bonjour ! Comment puis‑je vous aider ?" } }

Maintenant, traite la question suivante :

Question : ${userQuestion}
`;

  const response = await llama.call(prompt);
  console.log("Réponse brute du modèle:", response);

  const analysis = extractJSON(response);
  // fallback
  if (!analysis) {
  return {
    intent: "static",
    response: {
      text: "Désolé, je n’ai pas compris votre question. Pouvez‑vous la reformuler ?"
    }
  };
}

  return analysis;
}

// Generate user-facing response in French
async function generateResponse(data, userQuestion) {
  const prompt = `
Question de l'utilisateur : ${userQuestion}
Données trouvées (${data.length} résultats) : ${JSON.stringify(data)}

Génère une réponse naturelle en français basée sur ces données.

- Si aucune donnée n'est trouvée, indique-le poliment.
- Si plusieurs éléments sont trouvés, fais-en un résumé clair.
- Si c'est un tableau simple (distinct), liste les valeurs séparées par des virgules.
- Réponds en français et affiche les prix en dinars tunisiens (TND).
`;
  const resp = await llama.call(prompt);
  return resp.trim();
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

    // --- Gérer intent static ---
    if (analysis.intent === 'static' && analysis.response?.text) {
      return res.json({
        success: true,
        response: analysis.response.text,
        debug: { intent: 'static' }
      });
    }

    // handle unrecognized intent BEFORE any DB call
    if (analysis.intent === 'none' || !['search','aggregate','list','distinct'].includes(analysis.intent)) {
      return res.json({
        success: true,
        response: "Désolé, je n’ai pas compris votre demande. Pouvez‑vous reformuler ?",
        debug: { intent: analysis.intent }
      });
    }

    // --- Gérer intent distinct ---
    let data;
    if (analysis.intent === 'distinct' && analysis.field) {
      data = await mongoose.connection.db
        .collection(analysis.collection)
        .distinct(analysis.field);
    } else {
      // --- Convert category/subCategory to case-insensitive regex for search ---
      if (analysis.intent === 'search' && analysis.query) {
        if (analysis.query.category && typeof analysis.query.category === 'string') {
          analysis.query.category = new RegExp(`^${analysis.query.category}$`, 'i');
        }
        if (analysis.query.subCategory && typeof analysis.query.subCategory === 'string') {
          analysis.query.subCategory = new RegExp(`^${analysis.query.subCategory}$`, 'i');
        }
      }
      // --- Execute find or aggregate ---
      if (analysis.intent === 'aggregate') {
        data = await mongoose.connection.db
          .collection(analysis.collection)
          .aggregate(analysis.query)
          .toArray();
      } else {
        data = await mongoose.connection.db
          .collection(analysis.collection)
          .find(analysis.query)
          .toArray();
      }
    }

    console.log(`Résultats trouvés (${data.length}) dans ${analysis.collection}`);
    const responseText = await generateResponse(data, userQuestion);

    res.json({
      success: true,
      response: responseText,
      debug: {
        intent: analysis.intent,
        collection: analysis.collection,
        query: analysis.query,
        field: analysis.field,
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
