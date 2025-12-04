// controllers/userController.js
const User = require('../model/user-model');

// Create user
const createUser = async (req, res, next) => {
    const newUser = req.body;

    try {
        const user = new User(newUser);
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
                data: { users: userList },
            });
        } else {
            res.status(200).json({
                message: "No users found.",
                data: { users: userList },
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers
};