
const express = require("express");
const Address = require("../models/addressModel");
const router = express.Router();
 
// ✅ POST: Add a new address for a user (Avoids Duplicate Addresses)
router.post("/", async (req, res) => {
    try {
        const { email, fullName, street, city, state, zipCode, country, phone } = req.body;
 
        // Validate required fields
        if (!email || !fullName || !street || !city || !state || !zipCode || !country || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
 
        // Check if the exact same address already exists for this user
        const existingAddress = await Address.findOne({ email, street, city, state, zipCode, country, phone });
        if (existingAddress) {
            return res.status(200).json({ message: "Address already exists", address: existingAddress });
        }
 
        // Save new address if it's unique
        const newAddress = new Address({ email, fullName, street, city, state, zipCode, country, phone });
        await newAddress.save();
 
        res.status(201).json({ message: "Address added successfully", address: newAddress });
    } catch (error) {
        res.status(500).json({ message: "Error adding address", error });
    }
});
 
// ✅ GET: Fetch all addresses for a user by email
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const addresses = await Address.find({ email });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses", error });
    }
});
 
// ✅ PATCH: Update an existing address for a user
router.patch("/update", async (req, res) => {
    try {
        const { email, fullName, street, city, state, zipCode, country, phone } = req.body;
 
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
 
        // Find existing address and update
        const updatedAddress = await Address.findOneAndUpdate(
            { email },
            { fullName, street, city, state, zipCode, country, phone },
            { new: true }
        );
 
        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
 
        res.json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: "Error updating address", error });
    }
});
 
module.exports = router;