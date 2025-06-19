const mongoose = require("mongoose");

const SelectedProductSchema = new mongoose.Schema({
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
  customizationTypes: [{ type: String, trim: true }],
}, { _id: false });


const CustomizationSchema = new mongoose.Schema({

    firstName: { type: String, trim: true },
    lastName:  { type: String, trim: true },
    email:     { type: String, required: true, lowercase: true, trim: true },
    phone:     { type: String, trim: true },
    description: { type: String },

    products: [SelectedProductSchema],
      status: {
        type: String,
        enum: ["Non traitée", "En cours de négociation", "Traitée", "Annulée"],
        default: "Non traitée"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Customization", CustomizationSchema);