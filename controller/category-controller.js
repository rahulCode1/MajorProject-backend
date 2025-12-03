
const Category = require("../model/category-model")
const Product = require("../model/product-model")

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newCategory = new Category({ name, description });
        const saveCategory = await newCategory.save()

        res.status(201).json({
            success: true,
            data: {
                category: saveCategory,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAllCategories = async (req, res, next) => {
    try {

        const categories = await Category.find()

        if (categories.length !== 0) {
            res.status(200).json({ success: true, message: "All category fetched successfully.", data: { categories } })
        } else {
            res.status(400).json({ message: "No category found." })
        }
    } catch (error) {
        next(error)
    }
}

const getProductCategory = async (req, res, next) => {
    try {

        res.status(200).json({ message: "Product category fetched successfully.", data: { categories: ["StatuesIdols", "HomeDecor", "KitchenDining", "GardenOutdoor", "CorporateGifts", "ReligiousItems"] } })
    } catch (error) {
        next(error)
    }
}

const categoryById = async (req, res, next) => {
    const categoryId = req.params.id

    if (!categoryId) {
        return res.status(400).json({ message: "Please provide category id." })
    }
    try {

        const categoryDetails = await Category.findById(categoryId)

        if (categoryDetails) {
            res.status(200).json({ success: true, message: " Category details fetched successfully.", data: { category: categoryDetails } })
        } else {
            res.status(400).json({ message: "No category found." })
        }
    } catch (error) {
        next(error)
    }
}

const productsViaCategory = async (req, res, next) => {
    const { category } = req.query
    try {

        let filter = {}

        if (category) {
            filter.category = category
        }

        const productByCategoryFilter = await Product.find(filter)

        if (productByCategoryFilter.length !== 0) {
            res.status(200).json({ success: true, message: "All products found with that category.", data: { products: productByCategoryFilter } })
        } else {
            res.status(200).json({ success: true, message: "No product found on that category.", data: { products: HomeDecor } })
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: "Failed to get products via category." })
    }
}

module.exports = { addCategory, getAllCategories, getProductCategory, categoryById, productsViaCategory }