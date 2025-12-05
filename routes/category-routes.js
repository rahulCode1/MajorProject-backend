const express = require("express")
const { body } = require("express-validator")
const router = express.Router()


const { addCategory, getAllCategories, categoryById, productsViaCategory } = require("../controller/category-controller")
const { handleValidationErrors } = require("../middleware/validationHandler")

const categoryValidation = [body("name").trim().notEmpty().withMessage("Please provide category."),
body("description").trim().notEmpty().withMessage("Please provide description.")]


router.post("/category", categoryValidation, handleValidationErrors, addCategory)
router.get("/categories", getAllCategories)
router.get("/category/product_category", productsViaCategory)
router.get("/category/:id", categoryById)


module.exports = router 