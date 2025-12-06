const { default: mongoose } = require('mongoose');
const Order = require('../model/order-model')
const createOrder = async (req, res, next) => {
    const userId = req.params.id
    const orderData = req.body;




    try {
        const order = await Order.create({ ...orderData, orderPlacedBy: userId });
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

    try {

        const orders = await Order.find({ orderPlacedBy: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 })

        res.status(200).json({ message: "Orders find successfully.", data: { orders } })
    } catch (error) {
        next(error)
    }
}

const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id;



    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Please provide order id."
        });
    }

    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.status(200).json({
                success: true,
                message: "Order canceled successfully."
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Order not found."
            });
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