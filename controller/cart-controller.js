const mongoose = require("mongoose")
const Cart = require("../model/cart-model")
const Wishlist = require("../model/wishlist-model")
const HttpError = require("../model/http-error")

const addProductToCart = async (req, res, next) => {

    const userId = req.params.id

    if (!userId) {
        return next(new HttpError("Please provide user id to add product to cart.", 404))
    }

    const { productId, quantity } = req.body
    try {
        let cart = await Cart.findOne({ userId });
        // 2. If no cart, create new empty one
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            });
        }
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({ productId, quantity })
        }
        await cart.save()
        res.status(200).json({ success: true, message: "Product successfully added to cart.", data: { cart: cart.toObject({ getters: true }) } })
    } catch (error) {
        next(error)
    }

}


const getAllCartItems = async (req, res, next) => {
    const userId = req.params.id

    if (!userId) {
        return next(new HttpError("Please provide user id for view user cart.", 404))
    }

    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Cart fetched",
            cart: cart.items.map(cart => cart.toObject({ getters: true }))
        });
    } catch (error) { next(error) }
}




const increaseQuantity = async (req, res, next) => {
    const userId = req.params.id;

    if (!userId) {
        return next(new HttpError("Please provide user id for increase product quantity.", 404))
    }
    const { productId } = req.body;
    try {
        // Don't populate yet
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return next(new HttpError("Cart not found", 404))
        }
        // Now productId is just an ID, not an object
        const existingItem = cart.items.find(
            product => product.productId.toString() === productId
        );
        if (!existingItem) {
            return next(new HttpError("No product found on cart.", 404))
        }
        existingItem.quantity += 1;
        await cart.save();
        // Populate after saving
        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");


        res.status(200).json({
            success: true,
            message: "Quantity increased successfully.",
            cart: updatedCart.items.map(cart => cart.toObject({ getters: true }))
        });

    } catch (error) {
        next(error);
    }
};

const decreaseQuantity = async (req, res, next) => {
    const userId = req.params.id


    if (!userId) {
        return next(new HttpError("Please provide user id for decrease product quantity.", 404))
    }

    const { productId } = req.body
    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!cart) {
            return next(new HttpError("Cart not found.", 404))
        }
        const existingItem = cart.items.find(product => product.productId.toString() === productId)
        if (!existingItem) {
            return next(new HttpError("Product not found in cart", 404))
        }
        if (existingItem.quantity === 1) {

            cart.items = cart.items.filter(product => product.productId.toString() != productId)
        } else {
            existingItem.quantity -= 1
        }
        await cart.save()
        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");
        res.status(200).json({ success: true, message: "Quantity decrease successfully.", cart: updatedCart.items.map(cart => cart.toObject({ getters: true })) })
    } catch (error) { next(error) }
}




const removeFromCart = async (req, res, next) => {
    const userId = req.params.id

    if (!userId) {
        return next(new HttpError("Please provide user id for remove product from cart.", 404))
    }

    const { productId } = req.body
    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!cart) {
            return next(new HttpError("Cart not found", 404))
        }
        const existingItem = cart.items.find(product => product.productId.toString() === productId)
        if (!existingItem) {
            return next(new HttpError("Product not found on cart.", 404))
        }
        cart.items = cart.items.filter(product => product.productId.toString() !== productId)
        await cart.save()
        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("items.productId")
        res.status(200).json({ success: true, message: "Product successfully removed from cart.", cart: updatedCart.items.map(cart => cart.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }
}

const moveToWishlist = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide user id for move product to wishlist.", 404))
    }
    const { productId } = req.body


    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!cart) {
            return next(new HttpError("Cart not found for that user.", 404))
        }
        const existingCartItem = cart.items.find(product => product.productId.toString() === productId)
        if (!existingCartItem) {
            return next(new HttpError("Product not found on cart.", 404))
        }
        let wishlist = await Wishlist.findOne({ userId: new mongoose.Types.ObjectId(userId) })
        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, items: [] })
        }
        const existingWishlistItem = wishlist.items.find(product => product.productId.toString() === productId)
        if (existingWishlistItem) {
            return res.status(400).json({ message: "Product already exist on wishlist." })
        }
        wishlist.items.push({ productId })
        await wishlist.save()
        cart.items = cart.items.filter(product => product.productId.toString() !== productId)
        await cart.save()
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId")

        res.status(200).json({ success: true, message: "Product successfully moved to wishlist.", cart: updatedCart.items.map(cart => cart.toObject({ getters: true })) })
    } catch (error) {
        next(error)
    }

}


module.exports = { addProductToCart, getAllCartItems, increaseQuantity,
     decreaseQuantity, moveToWishlist, removeFromCart }
