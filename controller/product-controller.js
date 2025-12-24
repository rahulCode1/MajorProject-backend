const Product = require("../model/product-model")
const HttpError = require("../model/http-error")
const cloudinary = require("../config/cloudinary")

const addNewProduct = async (req, res, next) => {
    const { name,
        shortDescription,
        description,
        price,
        discountPrice,
        costPrice,
        length,
        width,
        height,
        weight,
        rating,
        materialType,
        category,
        care,
        tags,
        metaTitle,
        metaDescription,
        keywords } = req.body




    if (!req.files || req.files.length === 0) {
        return next(new HttpError("No image uploaded.", 400))

    }

    const uploadedImages = []




    try {


        for (file of req.files) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
             
            )

            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id
            })
        }

        const product = new Product({
            name,
            shortDescription,
            description,
            price,
            discountPrice,
            costPrice,
            length,
            width,
            height,
            weight,
            rating,
            materialType,
            category,
            care,
            tags,
            images: uploadedImages,
            metaTitle,
            metaDescription,
            keywords
        })



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