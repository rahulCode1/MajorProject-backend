const { default: mongoose } = require('mongoose');
const Order = require('../model/order-model')
const HttpError = require("../model/http-error")
const Cart = require("../model/cart-model")



const createOrder = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide user id for place order.", 404))
    }

    const orderData = req.body;

    const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
    if (!cart) {
        return next(new HttpError("User doesn't have cart.", 404))
    }
    if (cart.items.length !== 0) {
        cart.items = []
        await cart.save()
    }



    try {
        const order = new Order(orderData);
        const savedOrder = await order.save();



        res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: { order: savedOrder }
        });
    } catch (error) {
        next(error);
    }
};





const findUserOrders = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide user id for find user order.", 404))
    }
    try {
        const orders = await Order.find({
            orderPlacedBy: new mongoose.Types.ObjectId(userId)
        }).populate("products.productId").populate("address").sort({ createdAt: -1 })
        res.status(200).json({ message: "Orders find successfully.", data: { orders: orders.map(order => order.toObject({ getters: true })) } })

    } catch (error) {
        next(error)
    }
}

const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id;
    if (!orderId) {
        return next(new HttpError("Please provide order id for place order.", 404))
    }
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.status(200).json({
                success: true,
                message: "Order canceled successfully."
            });
        } else {
            return next(new HttpError("Order not found.", 404))
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,

    deleteOrder,
    findUserOrders

};