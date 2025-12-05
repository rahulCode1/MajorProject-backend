const express = require("express")
const router = express.Router()
const { addOrRemoveFromWishlist , getAllWishlistItems, moveToCart} = require("../controller/wishlist-controller")

router.post("/", addOrRemoveFromWishlist)
router.get("/:id", getAllWishlistItems)
router.patch("/:id", moveToCart)

module.exports = router