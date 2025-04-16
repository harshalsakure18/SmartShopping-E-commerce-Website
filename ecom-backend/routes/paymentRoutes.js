

const express = require("express");

const Razorpay = require("razorpay");

const Order = require("../models/orderModel");
 
const router = express.Router();
 
// ✅ Initialize Razorpay instance

const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET,

});
 
// ✅ Create Razorpay Order

router.post("/create-order", async (req, res) => {

    try {

        const { amount } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({ error: "Invalid order amount" });

        }
 
        const options = {

            amount: amount * 100, // Convert to paisa

            currency: "INR",

            receipt: `order_rcpt_${Date.now()}`,

            payment_capture: 1, // Auto capture payment

        };
 
        const order = await razorpay.orders.create(options);

        console.log("✅ Razorpay Order Created:", order);
 
        res.status(200).json({

            success: true,

            orderId: order.id,

            amount: order.amount,

            currency: order.currency,

        });

    } catch (error) {

        console.error("❌ Razorpay Order Error:", error);

        res.status(500).json({ error: "Failed to create Razorpay order" });

    }

});
 
// ✅ Store Order Without Signature Verification

router.post("/store-order", async (req, res) => {

    try {

        const { razorpay_order_id, razorpay_payment_id, orderData } = req.body;
 
        if (!razorpay_order_id || !razorpay_payment_id || !orderData) {

            return res.status(400).json({ error: "Missing required fields" });

        }
 
        // ✅ Save Order to Database

        const newOrder = new Order({

            ...orderData,

            paymentId: razorpay_payment_id,

            orderId: razorpay_order_id,

            paymentStatus: "Paid",

        });
 
        await newOrder.save();

        console.log("✅ Order Saved Successfully:", newOrder);
 
        res.status(200).json({ success: true, message: "Order Stored Successfully!" });

    } catch (error) {

        console.error("❌ Order Storage Error:", error);

        res.status(500).json({ error: "Failed to store order" });

    }

});
 
module.exports = router;

 