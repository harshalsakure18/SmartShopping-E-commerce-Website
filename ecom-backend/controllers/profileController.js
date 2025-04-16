const User = require('../models/userModel');

const getUserProfile = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Excluding password for security
        const { name, email: userEmail } = user;

        res.status(200).json({ name, email: userEmail });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

module.exports = { getUserProfile };
