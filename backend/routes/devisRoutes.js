const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const Devis = require("../models/Devis");
const Order = require("../models/Order");

// @route POST /api/devis
// @desc Submit a new devis
// @access Public
router.post("/", async (req, res) => {
  try {
    const devis = new Devis(req.body);
    await devis.save();
    res.status(201).json({ message: "Devis submitted successfully", devis });
  } catch (error) {
    console.error("Error submitting devis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// @route GET /api/devis
// @desc Retrieve all devis (for admin)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const allDevis = await Devis.find().sort({ createdAt: -1 });
    res.status(200).json(allDevis);
  } catch (error) {
    console.error("Error fetching devis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// @route GET /api/devis/:id
// @desc Get one devis by ID
// @access Private/Admin
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    if (!devis) {
      return res.status(404).json({ message: "Devis not found" });
    }
    res.status(200).json(devis);
  } catch (error) {
    console.error("Error fetching devis by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route PUT /api/devis/:id/status
// @desc Update devis status
// @access Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Non traitée",
      "En cours de négociation",
      "Traitée",
      "Annulée",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!devis) {
      return res.status(404).json({ message: "Devis introuvable" });
    }

    res.status(200).json({ message: "Statut mis à jour", devis });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


// @route POST /api/devis/:id/convert
// @desc Convert a devis to an order
// @access Private
router.post("/:id/convert", protect, async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);

    if (!devis) {
      return res.status(404).json({ message: "Devis not found" });
    }

    const { shippingAddress, totalPrice, paymentMethod } = req.body;

    if (!shippingAddress || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Missing required order data" });
    }

    const orderItems = devis.products.map((product) => ({
      productId: product._id,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      quantity: product.quantity,
    }));

    const order = new Order({
      user: devis.user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
    });

    await order.save();

    // Automatically update the status of the devis to 'traitée'
    devis.status = "Traitée";
    await devis.save();

    res.status(201).json({ message: "Order created from devis", order });
  } catch (error) {
    console.error("Error converting devis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;