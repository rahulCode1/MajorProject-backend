const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const { createUser, getAllUsers } = require("../controller/user-controller")
const userValidation = [
    check("name")
        .trim()
        .notEmpty().withMessage("Please provide user name.")
        .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters."),

    check("phoneNumber")
        .trim()
        .notEmpty().withMessage("Please provide phone number.")
        .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits.")
        .isNumeric().withMessage("Phone number must contain only digits.")
]


router.post('/', userValidation, createUser);      // POST /api/users
router.get('/', getAllUsers);

module.exports = router