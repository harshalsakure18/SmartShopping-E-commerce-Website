


const mongoose = require('mongoose');
 
const orderSchema = new mongoose.Schema({

    email: { type: String, required: true }, // Using email instead of userId

    items: [

        {

            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

            name: { type: String, required: true },

            price: { type: Number, required: true },

            quantity: { type: Number, required: true },

            size: { type: String, enum: ['S', 'M', 'L', 'XL','6', '7', '8', '9', '10', '11', '28', '30', '32', '34', '36', '38','2-3Y','3-4Y','4-5Y','5-6Y','6-7Y'], default: 'M'}

        }

    ],

    totalAmount: { type: Number, required: true },

    deliveryAddress: { type: String, required: true }, // Changed from address._id to full address as a string

    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' }, // Updated order status

    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' }, // Payment status field

    paymentId: { type: String }, // Store Razorpay payment ID

    orderDate: { type: Date, default: Date.now }

}, { timestamps: true });
 
const Order = mongoose.model('Order', orderSchema);
 
module.exports = Order;

