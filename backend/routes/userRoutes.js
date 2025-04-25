const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try { 
    // Registration logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ firstName, lastName, email, password });
    await user.save();
    
    // Create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };
    
    // Sign and return the token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
        if (err) throw err;

        //send the user and token in response
        res.status(201).json({
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            },
            token,
        });           
    });
      
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route Post /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      let user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "Invalid Credentials" });
  
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch)
        return res.status(400).json({ message: "Invalid Credentials" });

      // Create JWT Payload
      const payload = { user: { id: user._id, role: user.role } };
      
      // Sign and return the token along with user data
      jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
        if (err) throw err;

        //send the user and token in response
        res.json({
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            },
            token,
        });           
    });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected Route)
// @access Private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});
  
router.put("/:id", protect, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Not authorized to update this user" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;

      // Only update password if a new one is provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        message: "User updated successfully",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
