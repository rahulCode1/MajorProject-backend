const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/user-model");
const HttpError = require("../model/http-error");

// Create user
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("User exist already.", 403));
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({ name, email, password: hashPassword });
    const savedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "New user added successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// User login

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(new HttpError("User not exist.", 404));
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!comparePassword) {
      return next(new HttpError("Invalid user credentials.", 401));
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(200).json({
      success: true,
      message: "User login successfully.",
      token,
      name: existingUser.name,
      email: existingUser.email,
      userId: existingUser._id
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
        data: {
          users: userList.map((user) => user.toObject({ getters: true })),
        },
      });
    } else {
      return next(new HttpError("No product found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  login,
  getAllUsers,
};
