const express = require("express")
const router = express.Router()
const { createOrder, getAllOrders, getOrderDetails } = require("../controller/order-controller")

router.post('/', createOrder);

router.get('/', getAllOrders);

router.get('/:id', getOrderDetails);
module.exports = router 