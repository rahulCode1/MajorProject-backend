const express = require("express")
const router = express.Router()
const { addProductToCart, getAllCartItems, increaseQuantity, clearCart, moveToWishlist, decreaseQuantity, removeFromCart } = require("../controller/cart-controller")

router.post("/", addProductToCart)
router.get("/:id", getAllCartItems)
router.patch("/:id", increaseQuantity)
router.patch("/clear_cart/:id", clearCart)
router.patch("/decrease/:id", decreaseQuantity)
router.patch("/remove/:id", removeFromCart)
router.patch("/moveto_wishlist/:id", moveToWishlist)

module.exports = router