const mongoose = require("mongoose")



const orderSchema = new mongoose.Schema({

    products: [{
        name: { type: String, required: true },
        discountPrice: { type: Number, required: true },
        image: { type: String, required: true },
        height: { type: Number, required: true },
        quantity: { type: Number, required: true },
        materialType: { type: String, required: true },

    }],
    address: {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        zipCode: { type: Number, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true },
        fullAddress: { type: String, required: true },
        state: { type: String, required: true }
    },
    summary: {

        totalPrice: { type: Number, required: true },
        totalDiscount: { type: Number, required: true },
        totalQuantity: { type: Number, required: true },

    }, paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        required: true
    },
    paymentMethod: { type: String, required: true },

    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        required: true
    },
    orderPlacedBy: { type: mongoose.Types.ObjectId, ref: "User" }


}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
module.exports = Order
