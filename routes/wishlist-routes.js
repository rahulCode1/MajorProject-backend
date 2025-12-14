const express = require("express")
const { check } = require("express-validator")
const router = express.Router()
const { addOrRemoveFromWishlist, getAllWishlistItems, moveToCart } = require("../controller/wishlist-controller")
const wishlistValidation = [
    check("productId").trim().notEmpty().withMessage("Please provide product id to add to wishlist.")
]


router.post("/:id", wishlistValidation, addOrRemoveFromWishlist)
router.get("/:id", getAllWishlistItems)
router.patch("/:id", wishlistValidation, moveToCart)

module.exports = router