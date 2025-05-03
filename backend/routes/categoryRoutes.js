const express = require("express");
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/categories
// @desc Create a new category
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = new Category({ name, image });
    const createdCategory = await category.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/categories
// @desc Get all categories
// @access Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/categories/:id
// @desc Get a category by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/categories/:id
// @desc Update a category
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = name || category.name;
      category.image = image || category.image;

      const updated = await category.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/categories/:id
// @desc Delete a category
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;