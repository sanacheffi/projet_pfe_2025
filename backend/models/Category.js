const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: [
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
});

module.exports = mongoose.model("Category", categorySchema);