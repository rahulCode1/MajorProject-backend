const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { createOrder, deleteOrder, findUserOrders } = require("../controller/order-controller")


const orderValidation = [

    // Products
    check("products")
        .isArray({ min: 1 })
        .withMessage("Products must be a non-empty array."),

    check("products.*.productId")
        .isMongoId()
        .withMessage("Invalid product id."),

    check("products.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1."),

    // Address & User
    check("address")
        .isMongoId()
        .withMessage("Invalid address id."),

    check("orderPlacedBy")
        .isMongoId()
        .withMessage("Invalid user id."),

    // Summary
    check("summary.totalPrice")
        .isFloat({ min: 0.01 })
        .withMessage("Total price must be at least 0.01."),

    check("summary.totalDiscount")
        .isFloat({ min: 0 })
        .withMessage("Total discount must be non-negative."),

    check("summary.totalQuantity")
        .isInt({ min: 1 })
        .withMessage("Total quantity must be at least 1."),

    // Payment
    check("paymentMethod")
        .isIn(['COD', 'Card', 'UPI', 'NetBanking', 'Wallet'])
        .withMessage("Invalid payment method."),

    check("paymentStatus")
        .isIn(['pending', 'completed', 'failed', 'refunded'])
        .withMessage("Invalid payment status."),

    // Order status
    check("orderStatus")
        .optional()
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage("Invalid order status.")
];





router.post('/:id', orderValidation, createOrder);
router.get('/:id', findUserOrders);
router.delete("/:id", deleteOrder)

module.exports = router 