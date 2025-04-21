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

module.exports = router;