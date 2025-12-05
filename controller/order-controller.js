const Order = require('../model/order-model')
const createOrder = async (req, res, next) => {
    const orderData = req.body;

  
 

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

// Get All Orders
const getAllOrders = async (req, res, next) => {
    try {
        const orderList = await Order.find().sort({ createdAt: -1 }); // Latest first

        if (orderList.length !== 0) {
            res.status(200).json({
                success: true,
                message: "All orders fetched successfully.",
                data: { orders: orderList },
            });
        } else {
            res.status(200).json({
                success: true,
                message: "No orders found.",
                data: { orders: orderList },
            });
        }
    } catch (error) {
        next(error);
    }
};

// Get Order Details by ID
const getOrderDetails = async (req, res, next) => {
    const orderId = req.params.id;

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Please provide order id."
        });
    }

    try {
        const orderDetails = await Order.findById(orderId);

        if (orderDetails) {
            res.status(200).json({
                success: true,
                message: "Order details fetched successfully.",
                data: { order: orderDetails }
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






// Delete Order (Admin only - optional)
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
    getAllOrders,
    getOrderDetails,
    deleteOrder

};