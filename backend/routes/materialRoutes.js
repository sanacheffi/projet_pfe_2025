const express = require("express");
const Material = require("../models/Material");
const { protect , admin } = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/materials
// @desc Create a new material
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, supplier, price, quantity, images } = req.body;

    const material = new Material({
      name,
      supplier,
      price,
      quantity,
      images,
      user: req.user._id,
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/materials/:id
// @desc Update an existing material by ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, supplier, price, quantity, images } = req.body;

    const material = await Material.findById(req.params.id);

    if (material) {
      material.name = name || material.name;
      material.supplier = supplier || material.supplier;
      material.price = price || material.price;
      material.quantity = quantity || material.quantity;
      material.images = images || material.images;

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      res.status(404).json({ message: "Material not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/materials/:id
// @desc Delete a material by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      await material.deleteOne();
      res.json({ message: "Material removed" });
    } else {
      res.status(404).json({ message: "Material not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/materials/:id
// @desc Get a single material by ID
// @access Private/Admin
router.get("/:id", protect, admin, async (req, res) => {
    try {
      const material = await Material.findById(req.params.id);
  
      if (material) {
        res.json(material);
      } else {
        res.status(404).json({ message: "Material not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
});

// @route GET /api/admin/materials
// @desc Get all materials (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const materials = await Material.find({});
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;