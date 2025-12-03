const express = require("express")
const router = express.Router()

const { addNewAddress, getAllAddress, deleteAddress, updateAddress, addressDetails, updateIsDefault } = require("../controller/address-controller")



router.post("/new", addNewAddress)
router.get("/", getAllAddress)
router.get("/:id", addressDetails)
router.post("/update/:id", updateAddress)
router.post("/update/:id/default", updateIsDefault)
router.delete("/:id", deleteAddress)

module.exports = router 