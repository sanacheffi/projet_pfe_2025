const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    supplier: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
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
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Material", materialSchema);