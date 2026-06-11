const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
  addOrRemoveFromWishlist,
  getAllWishlistItems,
  moveToCart,
} = require("../controller/wishlist-controller");
const authCheck = require("../middleware/auth-check");
const wishlistValidation = [
  check("productId")
    .trim()
    .notEmpty()
    .withMessage("Please provide product id to add to wishlist."),
];

router.post("/:productId", authCheck, wishlistValidation, addOrRemoveFromWishlist);
router.get("/", authCheck, getAllWishlistItems);
router.patch("/:productId", authCheck, wishlistValidation, moveToCart);

module.exports = router;
