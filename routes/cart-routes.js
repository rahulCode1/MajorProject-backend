const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authCheck = require("../middleware/auth-check");

const {
  addProductToCart,
  getAllCartItems,
  increaseQuantity,
  moveToWishlist,
  decreaseQuantity,
  removeFromCart,
} = require("../controller/cart-controller");
const cartValidator = [
  check("productId").notEmpty().withMessage("Please provide product id."),
  check("quantity")
    .isFloat({ min: 1 })
    .withMessage("Product quantity minimum should be 1."),
];

const productIdValidator = [
  check("productId").notEmpty().withMessage("Please provide product id."),
];

router.post("/", cartValidator, authCheck, addProductToCart);
router.get("/", authCheck, getAllCartItems);
router.patch("/:productId/increase", productIdValidator, authCheck, increaseQuantity);
router.patch("/:productId/decrease", productIdValidator, authCheck, decreaseQuantity);
router.patch("/:productId/remove", productIdValidator, authCheck, removeFromCart);
router.patch(
  "/:productId/moveto_wishlist",

  productIdValidator,
  authCheck,
  moveToWishlist,
);

module.exports = router;
