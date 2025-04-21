const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Adresse email invalide'],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Contact', contactSchema);;