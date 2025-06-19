const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const Customization = require("../models/Customization");
const Order = require("../models/Order");

// @route POST /api/customization
// @desc Submit a new customization request
// @access Public
router.post("/", async (req, res) => {
  try {
    const customization = new Customization(req.body);
    await customization.save();
    res
      .status(201)
      .json({ message: "Demande de personnalisation enregistrée", customization });
  } catch (error) {
    console.error("Error submitting customization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route GET /api/customization
// @desc Retrieve all customization requests (admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const allCustomizations = await Customization.find().sort({ createdAt: -1 });
    res.status(200).json(allCustomizations);
  } catch (error) {
    console.error("Error fetching customizations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route GET /api/customization/:id
// @desc Get one customization by ID (admin only)
// @access Private/Admin
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);
    if (!customization) {
      return res.status(404).json({ message: "Personnalisation introuvable" });
    }
    res.status(200).json(customization);
  } catch (error) {
    console.error("Error fetching customization by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route PUT /api/customization/:id/status
// @desc Update customization status (admin only)
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

    const customization = await Customization.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!customization) {
      return res.status(404).json({ message: "Personnalisation introuvable" });
    }

    res.status(200).json({ message: "Statut mis à jour", customization });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


// @route POST /api/customization/:id/convert
// @desc Convert a customization into an order
// @access Private
router.post("/:id/convert", protect, async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);
    if (!customization) {
      return res.status(404).json({ message: "Personnalisation introuvable" });
    }

    const { shippingAddress, totalPrice, paymentMethod } = req.body;
    if (!shippingAddress || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Données de commande manquantes" });
    }

    const orderItems = customization.products.map((prod) => ({
      productId: prod._id,
      name: prod.name,
      image: prod.images[0]?.url || "",
      price: prod.price,
      quantity: prod.quantity,
    }));

    const order = new Order({
      user: customization.user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
    });
    await order.save();

    customization.status = "Traitée";
    await customization.save();

    res.status(201).json({ message: "Commande créée à partir de la personnalisation", order });
  } catch (error) {
    console.error("Error converting customization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
