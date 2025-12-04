const express = require("express")
const router = express.Router()
const { addProductToCart, getAllCartItems, increaseQuantity, decreaseQuantity, removeFromCart } = require("../controller/cart-controller")

router.post("/", addProductToCart)
router.get("/:id", getAllCartItems)
router.patch("/:id", increaseQuantity)
router.patch("/decrease/:id", decreaseQuantity)
router.patch("/remove/:id", removeFromCart)

module.exports = router