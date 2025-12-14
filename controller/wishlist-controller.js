const { default: mongoose } = require("mongoose")
const WishList = require("../model/wishlist-model")
const Cart = require("../model/cart-model")
const HttpError = require("../model/http-error")

const addOrRemoveFromWishlist = async (req, res, next) => {

    const userId = req.params.id


    if (!userId) {
        return next(new HttpError("Please provide user id.", 404))
    }

    const { productId } = req.body
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

        res.status(200).json({ message: "Wishlist update successfully.", wishlist: updatedWishlist.items.map(wishlist => wishlist.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }
}


const getAllWishlistItems = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide user id.", 404))
    }
    try {
        const wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");



        res.status(200).json({ success: true, message: "Wishlist fetched successfully.", wishlist: wishlist.items.map(wishlist => wishlist.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }
}



const moveToCart = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide both user  id.", 404))
    }
    const { productId } = req.body

    try {
        let wishlist = await WishList.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!wishlist) {
            return next(new HttpError("Wishlist not found for that user.", 404))
        }
        const existingWishlistItem = wishlist.items.find(product => product.productId.toString() === productId)
        if (!existingWishlistItem) {
            return next(new HttpError("Product not found on wishlist.", 404))
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
        res.status(200).json({ success: true, message: "Product successfully moved to cart.", wishlist: updatedWishlist.items.map(wish => wish.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }
}

module.exports = { addOrRemoveFromWishlist, getAllWishlistItems, moveToCart }