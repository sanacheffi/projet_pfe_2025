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
  

module.exports = router;
