const { default: mongoose } = require("mongoose")
const WishList = require("../model/wishlist-model")
const Cart = require("../model/cart-model")


const addOrRemoveFromWishlist = async (req, res, next) => {



    const { productId, userId } = req.body
    try {

        let wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })

        if (!wishlist) {
            wishlist = await WishList.create({ userId, items: [] })
        }


        const existingItem = wishlist.items.find(product => product.productId.toString() === productId)


        if (existingItem) {
            wishlist.items = wishlist.items.filter(product => product.productId.toString() !== productId)
        } else {
            wishlist.items.push({ productId })
        }

        await wishlist.save()

        const updatedWishlist = await WishList.findOne({ userId }).populate("items.productId")

        res.status(200).json({ message: "Wishlist update successfully.", wishlist: updatedWishlist })



    } catch (error) {
        next(error)
    }
}


const getAllWishlistItems = async (req, res, next) => {

    const userId = req.params.id

    try {

        const wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");




        res.status(200).json({ success: true, message: "Wishlist fetched successfully.", wishlist })


    } catch (error) {
        next(error)
    }
}

const removeFromWishlist = async (req, res, next) => {

    const userId = req.params.id
    const { productId } = req.body

    try {

        const wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })

        if (!wishlist) {
            return res.status(400).json({ message: "Wishlist not found." })
        }

        const existingItem = wishlist.items.find(product => product.productId.toString() === productId)


        if (!existingItem) {
            return res.status(400).json({ message: "Product not found on wishlist." })
        }

        wishlist.items = wishlist.items.filter(product => product._id !== productId)

        await wishlist.save()
    } catch (error) {
        next(error)
    }
}

const moveToCart = async (req, res, next) => {
    const userId = req.params.id
    const { productId } = req.body

    try {

        let wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })

        if (!wishlist) {
            return res.status(400).json({ message: "Wishlist not found for that user." })
        }

        const existingWishlistItem = wishlist.items.find(product => product.productId.toString() === productId)

        if (!existingWishlistItem) {
            return res.status(400).json({ message: "Product not found on wishlist." })
        }

        let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })

        if (!cart) {
            cart = await Cart.create({ userId, items: [] })
        }

        const existingItemInCart = cart.items.find(product => product.productId.toString() === productId)

        if (existingItemInCart) {
            existingItemInCart.quantity += 1
        } else {


            cart.items.push({ productId, quantity: 1 })
        }

        await cart.save()

        wishlist.items = wishlist.items.filter(product => product.productId.toString() !== productId)

        await wishlist.save()

        const updatedWishlist = await WishList.findOne({ userId }).populate("items.productId")

        res.status(200).json({ success: true, message: "Product successfully moved to cart.", wishlist: updatedWishlist })

    } catch (error) {
        next(error)
    }
}

module.exports = { addOrRemoveFromWishlist, getAllWishlistItems, moveToCart }