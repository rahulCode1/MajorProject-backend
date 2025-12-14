const express = require("express")
const { body, check } = require("express-validator")
const router = express.Router()
const { addNewProduct, getAllProducts, productDetails, deleteProduct } = require("../controller/product-controller")


const productValidation = [
    check("name")
        .trim()
        .notEmpty().withMessage("Product name is required.")
        .isLength({ min: 5, max: 100 }).withMessage("Name must be 5-100 characters"),

    check("shortDescription")
        .trim()
        .notEmpty().withMessage("Product short description is required.")
        .isLength({ min: 50, max: 500 }).withMessage("Short description must be 50-500 characters."),

    check("description")
        .trim()
        .notEmpty().withMessage("Product description is required."),

    check("price")
        .notEmpty().withMessage("Price is required.")
        .isFloat({ min: 0.01 }).withMessage("Price must be a positive number."),

    check("discountPrice")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage("Discount price must be a positive number.")
        .custom((value, { req }) => {
            if (value && value >= req.body.price) {
                throw new Error("Discount price must be less than regular price.")
            }
            return true
        }),

    check('costPrice')
        .notEmpty().withMessage("Cost price is required.")
        .isFloat({ min: 0 }).withMessage('Cost price must be a positive number.'),

    check('length')
        .notEmpty().withMessage("Length is required.")
        .isFloat({ min: 0.01 }).withMessage('Length must be a positive number.'),

    check('width')
        .notEmpty().withMessage("Width is required.")
        .isFloat({ min: 0.01 }).withMessage('Width must be a positive number.'),

    check('height')
        .notEmpty().withMessage("Height is required.")
        .isFloat({ min: 0.01 }).withMessage('Height must be a positive number.'),

    check('weight')
        .notEmpty().withMessage("Weight is required.")
        .isFloat({ min: 0.01 }).withMessage('Weight must be a positive number.'),

    check("materialType")
        .notEmpty().withMessage("Material type is required.")
        .isIn(['WhiteMarble', 'BlackMarble', 'GreenMarble', 'PinkMarble', 'Granite', 'Sandstone'])
        .withMessage("Invalid material type."),

    check("care")
        .notEmpty().withMessage("Care instructions are required.")
        .isArray({ min: 1 }).withMessage("Care instructions must be an array with at least one item."),

    check('category')
        .notEmpty().withMessage('Category is required.')
        .isIn(['StatuesIdols', 'HomeDecor', 'KitchenDining', 'GardenOutdoor', 'CorporateGifts', 'ReligiousItems'])
        .withMessage('Invalid category.'),

    check("tags")
        .notEmpty().withMessage('Tags are required.')
        .isArray({ min: 1 }).withMessage('At least one tag is required.'),

    check('image')
        .trim()
        .notEmpty().withMessage('Image URL is required.')
        .isURL().withMessage('Invalid image URL.'),

    check('metaTitle')
        .trim()
        .notEmpty().withMessage('Meta title is required.')
        .isLength({ max: 60 }).withMessage('Meta title must be under 60 characters.'),

    check('metaDescription')
        .trim()
        .notEmpty().withMessage('Meta description is required.')
        .isLength({ max: 160 }).withMessage('Meta description must be under 160 characters.'),

    check('keywords')
        .trim()
        .notEmpty().withMessage('Keywords are required.')
]



router.post("/product/add", productValidation,  addNewProduct)
router.get("/products", getAllProducts)

router.get("/product/:id", productDetails)
router.delete("/product/:id", deleteProduct)




module.exports = router 