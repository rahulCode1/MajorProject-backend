const mongoose = require("mongoose")
const Cart = require("../model/cart-model")

const addProductToCart = async (req, res, next) => {


    const { productId, quantity, userId } = req.body
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
       
        res.status(200).json({ success: true, message: "Product successfully added to cart.", cart })

    } catch (error) {
        next(error)
    }

}

const getAllCartItems = async (req, res, next) => {
    const userId = req.params.id
    try {

        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");



        res.status(200).json({
            success: true,
            message: "Cart fetched",
            cart
        });

    } catch (error) { next(error) }
}

const increaseQuantity = async (req, res, next) => {
    const userId = req.params.id;
    const { productId } = req.body;

    try {
        // Don't populate yet
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Now productId is just an ID, not an object
        const existingItem = cart.items.find(
            product => product.productId.toString() === productId
        );

        if (!existingItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        existingItem.quantity += 1;

        await cart.save();

        // Populate after saving
        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Quantity increased successfully.",
            cart: updatedCart
        });

    } catch (error) {
        next(error);
    }
};

const decreaseQuantity = async (req, res, next) => {
    const userId = req.params.id
    const { productId } = req.body

    try {
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
           



        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const existingItem = cart.items.find(product => product.productId.toString() === productId)




        if (!existingItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }


        if (existingItem.quantity === 1) {

            cart.items = cart.items.filter(product => product.productId.toString() != productId)
        } else {
            existingItem.quantity -= 1
        }



        await cart.save()

        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId");

        res.status(200).json({ success: true, message: "Quantity decrease successfully.", cart: updatedCart })
    } catch (error) { next(error) }
}




const removeFromCart = async (req, res, next) => {

    const userId = req.params.id
    const { productId } = req.body


    console.log(productId)

    try {

        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

       

        console.log(cart)

        const existingItem = cart.items.find(product => product.productId.toString() === productId)
        
    console.log(cart)
    console.log(existingItem, "Existing item ")

        if (!existingItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.items = cart.items.filter(product => product.productId.toString() !== productId)

        await cart.save()

        const updatedCart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("items.productId")

        res.status(200).json({ success: true, message: "Product successfully removed from cart.", cart: updatedCart })
    } catch (error) {
        next(error)
    }
}

module.exports = { addProductToCart, getAllCartItems, increaseQuantity, decreaseQuantity, removeFromCart }