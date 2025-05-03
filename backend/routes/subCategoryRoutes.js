const express = require("express");
const SubCategory = require("../models/SubCategory");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/subcategories
// @desc Create a new subcategory
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, category } = req.body;

    const subCategory = new SubCategory({ name, category });
    const created = await subCategory.save();

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/subcategories
// @desc Get all subcategories
// @access Public
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name");
    res.json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/subcategories/:id
// @desc Get a subcategory by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("category", "name");
    if (subCategory) {
      res.json(subCategory);
    } else {
      res.status(404).json({ message: "SubCategory not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/subcategories/:id
// @desc Update a subcategory
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, category } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
      subCategory.name = name || subCategory.name;
      subCategory.category = category || subCategory.category;

      const updated = await subCategory.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: "SubCategory not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/subcategories/:id
// @desc Delete a subcategory
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
      await subCategory.deleteOne();
      res.json({ message: "SubCategory removed" });
    } else {
      res.status(404).json({ message: "SubCategory not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;