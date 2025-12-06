const express = require("express")
const router = express.Router()
const { createOrder, deleteOrder, findUserOrders } = require("../controller/order-controller")

router.post('/:id', createOrder);
router.get('/:id', findUserOrders);
router.delete("/:id", deleteOrder)

module.exports = router 