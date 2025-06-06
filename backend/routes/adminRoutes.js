const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "L'adresse e-mail existe déjà" });
      }
      user = new User({ 
        firstName, 
        lastName, 
        email, 
        password, 
        role: role || "client" });
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (admin only) - firstName, lastName, email and role
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
      }
      const updatedUser = await user.save();
      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});  
module.exports = router;