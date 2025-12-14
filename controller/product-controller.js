const Product = require("../model/product-model")
const HttpError = require("../model/http-error")

const addNewProduct = async (req, res, next) => {
    const newProduct = req.body
    try {
        const product = new Product(newProduct)
        const saveProduct = await product.save()

        if (saveProduct) {
            res.status(200).json({ message: "New product added successfully.", saveProduct })
        } else {
            return next(new HttpError("No product add.", 404))
        }

    } catch (error) {

        next(error)
    }
}



const getAllProducts = async (req, res, next) => {

    try {


        const productsList = await Product.find()


        if (productsList.length !== 0) {
            res.status(200).json({ success: true, message: "All product fetched successfully.", data: { products: productsList.map(product => product.toObject({ getters: true })) } })

        } else {
            return next(new HttpError("No product found.", 404))
        }
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id

    if (!productId) {
        return next(new HttpError("Please provide product id.", 404))
    }
    try {

        const deletedProduct = await Product.findByIdAndDelete(productId)

        if (deleteProduct) {
            res.status(200).json({ success: true, message: "Product deleted successfully.", deletedProduct })
        } else {
            return next(new HttpError("No product found for delete.", 404))
        }
    } catch (error) {
        next(error)
    }
}

const productDetails = async (req, res, next) => {
    const productId = req.params.id


    if (!productId) {
        return next(new HttpError("Please provide product id.", 404))
    }
    try {

        const productDetails = await Product.findById(productId)
        const similarProducts = await Product.find({ category: productDetails.category, _id: { $ne: productDetails._id } }).limit(5)

        if (productDetails) {
            res.status(200).json({ success: true, message: " Product details fetched successfully.", data: { product: productDetails.toObject({ getters: true }), similarProducts: similarProducts.map(product => product.toObject({ getters: true })) } })
        } else {
            return next(new HttpError("No product found.", 404))
        }
    } catch (error) {
        next(error)
    }

}

module.exports = { addNewProduct, getAllProducts, deleteProduct, productDetails }