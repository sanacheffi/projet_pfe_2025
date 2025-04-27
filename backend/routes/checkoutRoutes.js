const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const axios = require("axios");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
require("dotenv").config();
const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice, guestId } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    // Create a checkout document
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: paymentMethod === "Paiement en ligne" ? "En attente" : "Paiement à la Livraison",
      isPaid: paymentMethod === "Paiement à la livraison",
      paidAt: paymentMethod === "Paiement à la livraison" ? Date.now() : null,
    });

    // Auto-finalize if it's COD
    if (paymentMethod === "Paiement à la livraison") {
      const order = await Order.create({
        user: newCheckout.user,
        orderItems: newCheckout.checkoutItems,
        shippingAddress: newCheckout.shippingAddress,
        paymentMethod: newCheckout.paymentMethod,
        totalPrice: newCheckout.totalPrice,
        isPaid: false,
        paidAt: newCheckout.paidAt,
        paymentStatus: "Paiement à la Livraison",
      });

      for (const item of newCheckout.checkoutItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { countInStock: -item.quantity }
        });
      };      

      newCheckout.isFinalized = true;
      newCheckout.finalizedAt = Date.now();
      await newCheckout.save();

      // console.log("Deleting cart for user:", req.user._id);
      // console.log("Guest ID (if any):", guestId);
      
      // const cartToDelete = await Cart.findOne({
      //   $or: [
      //     { user: req.user._id },
      //     { guestId }
      //   ]
      // });
      // console.log("Cart to delete:", cartToDelete);
      await Cart.findOneAndDelete({
        $or: [
          { user: req.user._id },
          { guestId }
        ]
      });
          
      return res.status(201).json({ message: "Commande créée (COD)", order });
    }

    
    // If Flouci, create a payment session
    if (paymentMethod === "Paiement en ligne") {
      const payload = {
        app_token: "536aaec9-6214-4b59-9947-bf35f666a488",
        app_secret: process.env.FLOUCI_SECRET,
        amount: totalPrice * 1000, // in millimes
        accept_card: "true",
        session_timeout_secs: 1200,
        success_link: `http://localhost:9000/api/checkout/${newCheckout._id}/success`,
        fail_link: `http://localhost:9000/api/checkout/${newCheckout._id}/fail`,
        developer_tracking_id: "ae55482e-1b66-4658-9ac6-1d752db05c35",
      };
      const flouciResponse = await axios.post(
        "https://developers.flouci.com/api/generate_payment",
        payload
      );
      return res.status(201).json({
        checkout: newCheckout,
        paymentLink: flouciResponse.data.result.link,
        sessionId: flouciResponse.data.result.payment_id,
      });      
    }
  } catch (error) {
    console.error("Error in checkout:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// @route GET /api/checkout/:id/success
// @desc Finalize order after Flouci success
// @access Public (Flouci redirect)
router.get("/:id/success", async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout || checkout.isFinalized) {
      return res.status(400).send("Checkout déjà finalisé ou introuvable");
    }

    const verifyUrl = `https://developers.flouci.com/api/verify_payment/${req.query.payment_id}`;
    const result = await axios.get(verifyUrl, {
      headers: {
        apppublic: "536aaec9-6214-4b59-9947-bf35f666a488",
        appsecret: process.env.FLOUCI_SECRET,
      },
    });

    const paymentData = result.data;

    if (paymentData.success === true) {
      checkout.isPaid = true;
      checkout.paidAt = Date.now();
      checkout.paymentStatus = "Payé";
      checkout.paymentDetails = paymentData;
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      const order = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        paymentStatus: "Payé",
        paymentDetails: paymentData,
      });

      await Cart.findOneAndDelete({
        $or: [
          { user: checkout.user },
          { guestId: checkout.guestId }
        ]
      });      

      return res.status(201).json({ message: "Paiement validé et commande créée", order });
    } else {
      return res.status(400).send("Paiement non validé");
    }
  } catch (error) {
    console.error("Erreur de vérification Flouci:", error.message);
    res.status(500).send("Erreur de paiement");
  }
});

module.exports = router;
