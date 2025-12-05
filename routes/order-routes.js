const express = require("express")
const router = express.Router()
const { createOrder, getAllOrders, getOrderDetails, deleteOrder } = require("../controller/order-controller")

router.post('/', createOrder);

router.get('/', getAllOrders);

router.get('/:id', getOrderDetails);
router.delete("/:id", deleteOrder)
module.exports = router 