// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,

    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,

    },
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }]
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema)
module.exports = User 