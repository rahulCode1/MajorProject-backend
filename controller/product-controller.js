const Product = require("../model/product-model")

const addNewProduct = async (req, res, next) => {
    const newProduct = req.body



    try {


        const product = new Product(newProduct)
        const saveProduct = await product.save()


        res.status(200).json({ message: "New product added successfully.", saveProduct })


    } catch (error) {

        next(error)
    }
}



const getAllProducts = async (req, res, next) => {
    const { category } = req.query
    try {

        let filter = {}

        if (category) {
            filter.category = category
        }
        const productsList = await Product.find(filter)

        if (productsList.length !== 0) {
            res.status(200).json({ success: true, message: "All product fetched successfully.", data: { products: productsList } })
        } else {
            res.status(200).json({ message: "No product found.", data: { products: productsList } })
        }
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id

    if (!productId) {
        return res.status(400).json({ message: "Please provide product id." })
    }
    try {

        const deletedProduct = await Product.findByIdAndDelete(productId)

        if (deleteProduct) {
            res.status(200).json({ success: true, message: "Product deleted successfully.", deletedProduct })
        } else {
            res.status(400).json({ message: "No product found for delete." })
        }
    } catch (error) {
        next(error)
    }
}

const productDetails = async (req, res, next) => {
    const productId = req.params.id

    if (!productId) {
        return res.status(400).json({ message: "Please provide product id." })
    }
    try {

        const productDetails = await Product.findById(productId)

        if (productDetails) {
            res.status(200).json({ success: true, message: " Product details fetched successfully.", data: { product: productDetails } })
        } else {
            res.status(400).json({ message: "No product found." })
        }
    } catch (error) {
        next(error)
    }

}

const getByCategories = async (req, res, next) => {

    const category = req.params.productCategory
    try {

        const productByCategory = await Product.find({ category })

        if (productByCategory.length !== 0) {
            res.status(200).json({ success: true, message: " Product  fetched successfully via category.", data: { product: productByCategory } })
        } else {
            res.status(400).json({ message: "No product found." })
        }
    } catch (error) {
        next(error)
    }
}



module.exports = { addNewProduct, getAllProducts, deleteProduct, productDetails, getByCategories }