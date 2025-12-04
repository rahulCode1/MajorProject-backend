const express = require("express")
const router = express.Router()
const { addOrRemoveFromWishlist , getAllWishlistItems} = require("../controller/wishlist-controller")

router.post("/", addOrRemoveFromWishlist)
router.get("/:id", getAllWishlistItems)

module.exports = router