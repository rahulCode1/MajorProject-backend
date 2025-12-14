const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { createOrder, deleteOrder, findUserOrders } = require("../controller/order-controller")


const orderValidation = [
    // Products validation
    check("products")
        .notEmpty().withMessage("Products are required.")
        .isArray({ min: 1 }).withMessage("At least one product is required."),

    check("products.*.name")
        .trim()
        .notEmpty().withMessage("Product name is required."),

    check("products.*.discountPrice")
        .notEmpty().withMessage("Product discount price is required.")
        .isFloat({ min: 0.01 }).withMessage("Product discount price must be a positive number."),

    check("products.*.image")
        .trim()
        .notEmpty().withMessage("Product image is required.")
        .isURL().withMessage("Product image must be a valid URL."),

    check("products.*.height")
        .notEmpty().withMessage("Product height is required.")
        .isFloat({ min: 0.01 }).withMessage("Product height must be a positive number."),

    check("products.*.quantity")
        .notEmpty().withMessage("Product quantity is required.")
        .isInt({ min: 1 }).withMessage("Product quantity must be at least 1."),

    check("products.*.materialType")
        .notEmpty().withMessage("Product material type is required.")
        .isIn(['WhiteMarble', 'BlackMarble', 'GreenMarble', 'PinkMarble', 'Granite', 'Sandstone'])
        .withMessage("Invalid material type."),

    // Address validation
    check("address.name")
        .trim()
        .notEmpty().withMessage("Please provide user name.")
        .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters."),

    check("address.phoneNumber")
        .trim()
        .notEmpty().withMessage("Please provide phone number.")
        .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits.")
        .isNumeric().withMessage("Phone number must contain only digits."),

    check("address.zipCode")
        .trim()
        .notEmpty().withMessage("Please provide zip code.")
        .isLength({ min: 6, max: 6 }).withMessage("Zip code must be exactly 6 digits.")
        .isNumeric().withMessage("Zip code must contain only digits."),

    check("address.area")
        .trim()
        .notEmpty().withMessage("Please provide area name.")
        .isLength({ min: 2, max: 100 }).withMessage("Area must be 2-100 characters."),

    check("address.city")
        .trim()
        .notEmpty().withMessage("Please provide city name.")
        .isLength({ min: 2, max: 50 }).withMessage("City must be 2-50 characters."),

    check("address.fullAddress")
        .trim()
        .notEmpty().withMessage("Please provide full address including house number, street name, and nearby landmark.")
        .isLength({ min: 10, max: 500 }).withMessage("Full address must be 10-500 characters."),

    check("address.state")
        .trim()
        .notEmpty().withMessage("Please select your state.")
        .isLength({ min: 2, max: 50 }).withMessage("State must be 2-50 characters."),

    // Order summary validation
    check("summary.totalPrice")
        .notEmpty().withMessage("Total price is required.")
        .isFloat({ min: 0.01 }).withMessage("Total price must be at least 0.01."),

    check("summary.totalDiscount")
        .notEmpty().withMessage("Total discount is required.")
        .isFloat({ min: 0 }).withMessage("Total discount must be a non-negative number."),

    check("summary.totalQuantity")
        .notEmpty().withMessage("Total quantity is required.")
        .isInt({ min: 1 }).withMessage("Total quantity must be at least 1."),

    // Payment method validation
    check("paymentMethod")
        .trim()
        .notEmpty().withMessage("Please provide payment method to place order.")
        .isIn(['COD', 'Card', 'UPI', 'NetBanking', 'Wallet']).withMessage("Invalid payment method.")
]




router.post('/:id', orderValidation,  createOrder);
router.get('/:id', findUserOrders);
router.delete("/:id", deleteOrder)

module.exports = router 