const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { addProductToCart, getAllCartItems, increaseQuantity, moveToWishlist, decreaseQuantity, removeFromCart } = require("../controller/cart-controller")
const cartValidator = [
    check("productId").notEmpty().withMessage("Please provide product id."),
    check("quantity").isFloat({ min: 1 }).withMessage("Product quantity minimum should be 1.")
]

const productIdValidator = [
    check("productId").notEmpty().withMessage("Please provide product id.")
]



router.post("/:id", cartValidator, addProductToCart)
router.get("/:id", getAllCartItems)
router.patch("/:id", productIdValidator, increaseQuantity)
router.patch("/decrease/:id", productIdValidator, decreaseQuantity)
router.patch("/remove/:id", productIdValidator, removeFromCart)
router.patch("/moveto_wishlist/:id", productIdValidator, moveToWishlist)

module.exports = router