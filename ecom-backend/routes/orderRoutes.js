


const express = require("express");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const router = express.Router();
 
// ✅ Create Order (Initiate Order without Payment)
router.post("/", async (req, res) => {
    try {
        const { email, items, totalAmount, deliveryAddress } = req.body;
 
        console.log("Incoming order data:", req.body);
 
        if (!email || !totalAmount || !deliveryAddress || !items?.length) {
            return res.status(400).json({ error: "All fields are required (email, totalAmount, deliveryAddress, items)" });
        }
 
        // Validate if products exist
        const updatedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            return {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size || 'M'
            };
        }));
 
        const newOrder = new Order({
            email,
            items: updatedItems,
            totalAmount,
            deliveryAddress,
            orderStatus: "Processing",  // Set as pending until payment is successful
            paymentStatus: "Pending"
        });
 
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({ error: err.message });
    }
});
 
// ✅ Update Order After Payment (Mark as Paid)
router.patch("/payment-success/:orderId", async (req, res) => {
    try {
        const { paymentId } = req.body;
 
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { 
                orderStatus: "Paid",
                paymentStatus: "Paid",
                paymentId
            },
            { new: true }
        );
 
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
 
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// ✅ Get All Orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// ✅ Get Orders by User Email
router.get("/user/:email", async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email });
        if (!orders.length) return res.status(404).json({ message: "No orders found for this user" });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// ✅ Get Order by Order ID
router.get("/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
// ✅ Delete Order
router.delete("/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
 
        if (!order) return res.status(404).json({ error: "Order not found" });
 
        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete order" });
    }
});
 
module.exports = router;