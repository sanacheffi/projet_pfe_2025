const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  collectionName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock_status: {
    type: String,
    enum: ['en_stock', 'rupture_de_stock', 'sur_commande'],
    default: 'en_stock'
  },
  dimensions: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      altText: {
        type: String
      }
    },
  ],
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
},{ timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);