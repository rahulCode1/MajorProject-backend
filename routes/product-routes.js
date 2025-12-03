const express = require("express")
const { body } = require("express-validator")
const router = express.Router()
const { addNewProduct, getAllProducts, productDetails, deleteProduct, getByCategories } = require("../controller/product-controller")
const { handleValidationErrors } = require("../middleware/validationHandler")

const productValidation = [
    body("name").trim().notEmpty().withMessage("Product name is required.").isLength({ min: 5, max: 100 }).withMessage("Name must be 5-100 characters"),
    body("shortDescription").trim().notEmpty().withMessage("Product short description is required.").isLength({  max: 500 }).withMessage("Short description must be 50-500 characters. "),
    body("description").trim().notEmpty().withMessage("Product description required."),
    body("price").isFloat({ min: 0 }).withMessage("Price should be positive number."),
    body("discountPrice").isFloat({ min: 0 }).withMessage("Discount price should be positive number.").custom((value, { req }) => {
        if (value >= req.body.price) {
            throw new Error("Discount price must be less than regular price.")
        }
        return true
    }),
    body('costPrice')
        .isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),

    body('length')
        .isFloat({ min: 0 }).withMessage('Length must be a positive number'),

    body('width')
        .isFloat({ min: 0 }).withMessage('Width must be a positive number'),

    body('height')
        .isFloat({ min: 0 }).withMessage('Height must be a positive number'),

    body('weight')
        .isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body("materialType").notEmpty().withMessage("Material type is required.").isIn(['WhiteMarble', 'BlackMarble', 'GreenMarble', 'PinkMarble', 'Granite', 'Sandstone']).withMessage("Invalid material type."),
    body("care").isArray({ min: 1 }).withMessage("Care instructions must be an array with at least one item "),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['StatuesIdols', 'HomeDecor', 'KitchenDining', 'GardenOutdoor', 'CorporateGifts', 'ReligiousItems'])
        .withMessage('Invalid category'),
    body("tags").isLength({ min: 1 }).withMessage('At list one tag is required.'),
    body('image')
        .trim()
        .notEmpty().withMessage('Image URL is required')
        .isURL().withMessage('Invalid image URL'),

    body('metaTitle')
        .trim()
        .notEmpty().withMessage('Meta title is required')
        .isLength({ max: 60 }).withMessage('Meta title must be under 60 characters'),

    body('metaDescription')
        .trim()
        .notEmpty().withMessage('Meta description is required')
        .isLength({ max: 160 }).withMessage('Meta description must be under 160 characters'),

    body('keywords')
        .trim()
        .notEmpty().withMessage('Keywords are required')

]

router.get("/product/category/:productCategory", getByCategories)
router.post("/product/add", productValidation, handleValidationErrors, addNewProduct)
router.get("/products", getAllProducts)

router.get("/product/:id", productDetails)
router.delete("/product/:id", deleteProduct)




module.exports = router 