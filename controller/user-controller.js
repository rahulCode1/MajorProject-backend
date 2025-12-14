// controllers/userController.js
const User = require('../model/user-model');
const HttpError = require("../model/http-error")

// Create user
const createUser = async (req, res, next) => {
    const { name, phoneNumber } = req.body;



    try {
        const user = new User({ name, phoneNumber, address: [], orders: [] });
        const savedUser = await user.save();

        res.status(200).json({
            message: "New user added successfully.",
            savedUser
        });
    } catch (error) {
        next(error);
    }
};

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const userList = await User.find();

        if (userList.length !== 0) {
            res.status(200).json({
                success: true,
                message: "All users fetched successfully.",
                data: { users: userList.map(user => user.toObject({ getters: true })) },
            });
        } else {
            return next(new HttpError("No product found.", 404))
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers
};