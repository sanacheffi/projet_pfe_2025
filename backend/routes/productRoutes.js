const express = require("express");
const Product = require("../models/Product");
const { protect , admin } = require("../middleware/authMiddleware");
const router = express.Router();


// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
        name, 
        description, 
        price,
        countInStock, 
        category,
        subCategory,
        stock_status,
        dimensions,
        material, 
        images,
    } = req.body;

    const product = new Product({
        name, 
        description, 
        price,
        countInStock, 
        category,
        subCategory,
        stock_status,
        dimensions,
        material, 
        images,
        user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
} catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
}

});


// @route PUT /api/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const {
            name, 
            description, 
            price,
            countInStock, 
            category,
            subCategory,
            stock_status,
            dimensions,
            material, 
            images,
        } = req.body;

        // Find product by ID
        const product = await Product.findById(req.params.id);
        if (product) {
            // Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.subCategory = subCategory || product.subCategory;
            product.stock_status = stock_status || product.stock_status;
            product.dimensions = dimensions || product.dimensions;
            product.material = material || product.material;
            product.images = images || product.images;
            
            // Save the updated product
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
      // Find the product by ID
      const product = await Product.findById(req.params.id);
      if (product) {
        // Remove the product from DB
        await product.deleteOne();
        res.json({ message: "Product removed" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// @route GET /api/products
// @desc Get products by category and optionally subCategory
// @access Public
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, sortBy, search } = req.query;

    const query = {};
    let sort = {};

    // Filter logic
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (subCategory && subCategory.toLowerCase() !== "all") {
      query.subCategory = subCategory;
    }

    // Search logic
    if (search) {
      query.$or = [
        { name: { $regex: `\\b${search}\\b`, $options: "i" } },
        { description: { $regex: `\\b${search}\\b`, $options: "i" } }
      ];
    }

    // Sort Logic
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        default:
          sort = { createdAt: -1 };
          break;
      }
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sort);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation date
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    // Fetch latest 8 products
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/all
// @desc Get all products without any filter
// @access Public
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on the current product's category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product ID
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;