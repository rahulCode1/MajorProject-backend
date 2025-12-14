const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { addNewAddress, getUserAddress, deleteAddress, updateAddress, updateIsDefault, findAddressById } = require("../controller/address-controller")



const addressValidation = [
    check("name")
        .trim()
        .notEmpty().withMessage("Please provide user name.")
        .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters."),

    check("phoneNumber")
        .trim()
        .notEmpty().withMessage("Please provide phone number.")
        .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits.")
        .isNumeric().withMessage("Phone number must contain only digits."),

    check("zipCode")
        .trim()
        .notEmpty().withMessage("Please provide zip code.")
        .isLength({ min: 6, max: 6 }).withMessage("Zip code must be exactly 6 digits.")
        .isNumeric().withMessage("Zip code must contain only digits."),

    check("area")
        .trim()
        .notEmpty().withMessage("Please provide area name.")
        .isLength({ min: 2, max: 100 }).withMessage("Area must be 2-100 characters."),

    check("city")
        .trim()
        .notEmpty().withMessage("Please provide city name.")
        .isLength({ min: 2, max: 50 }).withMessage("City must be 2-50 characters."),

    check("fullAddress")
        .trim()
        .notEmpty().withMessage("Please provide full address including house number, street name, and nearby landmark.")
        .isLength({ min: 10, max: 500 }).withMessage("Full address must be 10-500 characters."),

    check("state")
        .trim()
        .notEmpty().withMessage("Please select your state.")
        .isLength({ min: 2, max: 50 }).withMessage("State must be 2-50 characters.")
]

router.post("/new", addressValidation, addNewAddress)
router.get("/:id", getUserAddress)
router.get("/address_info/:id", findAddressById)
router.patch("/update/:id/default", updateIsDefault)
router.patch("/update/:id", updateAddress)
router.delete("/:id", deleteAddress)


module.exports = router 