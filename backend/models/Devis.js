const mongoose = require("mongoose");

const devisProductSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true },
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
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true,
  },
}, { _id: false });

const devisSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  description: { type: String },
  products: [devisProductSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
}, { timestamps: true });

module.exports = mongoose.model("Devis", devisSchema);
