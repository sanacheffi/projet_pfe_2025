const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); 
const { protect, admin } = require("../middleware/authMiddleware");

// @route POST /api/contacts
// @desc Submit a contact message (public)
// @access Public
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const contact = new Contact({
      name,
      phone,
      email,
      subject,
      message,
    });

    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

// @route GET /api/contacts
// @desc Get all contact messages (admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

// @route PATCH /api/contacts/:id/treated
// @desc Toggle treated flag (admin only)
// @access Private/Admin
router.patch("/:id/treated", protect, admin, async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Réclamation introuvable" });
      }
      contact.treated = !contact.treated;
      const updated = await contact.save();
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur du serveur" });
    }
  }
);

module.exports = router;