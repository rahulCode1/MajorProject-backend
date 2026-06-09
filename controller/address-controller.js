const { validationResult } = require("express-validator");
const Address = require("../model/user-address-model");
const HttpError = require("../model/http-error");
const User = require("../model/user-model");
const { default: mongoose } = require("mongoose");

// Add New Address
const addNewAddress = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const userId = req.userId;
  const { name, phoneNumber, area, city, fullAddress, state, zipCode } =
    req.body;

  try {
    const address = new Address({
      name,
      phoneNumber,
      area,
      city,
      fullAddress,
      state,
      zipCode,
      userId,
    });

    await address.save();
    res.status(200).json({
      message: "New address added successfully.",
      address: address.toObject({ getters: true }),
    });
  } catch (error) {
    return next(error);
  }
};

// Get user Addresses
const getUserAddress = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return next(new HttpError("User id required to find user address.", 404));
  }

  try {
    let userAddress = await Address.find({ userId });

    res.status(200).json({
      message: "User address find successfully.",
      address: userAddress.map((add) => add.toObject({ getters: true })),
    });
  } catch (error) {
    next(error);
  }
};

// Delete Address
const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId) {
    return next(new HttpError("Please provide address id.", 404));
  }

  try {
    const userAddress = await Address.findById(addressId);
    if (!userAddress) {
      return next(new HttpError("Address not found with provided id.", 404));
    }

    await userAddress.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Address removed successfully." });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId) {
    return next(
      new HttpError("Please provide address id to update address.", 404),
    );
  }
  const updateData = req.body;
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      updateData,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Address update successfully",
      data: { address: updatedAddress.toObject({ getters: true }) },
    });
  } catch (error) {
    next(error);
  }
};

const updateIsDefault = async (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId) {
    return next(
      new HttpError(
        "Please provide address id to update default address.",
        404,
      ),
    );
  }

  try {
    await Address.updateMany({}, { isDefault: false });
    const updatedAddressStatus = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Address status update successfully",
      addressId,
    });
  } catch (error) {
    next(error);
  }
};

const findAddressById = async (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId) {
    return next(
      new HttpError("Please provide address id to update address.", 404),
    );
  }

  try {
    const addressInfo = await Address.findById(addressId);

    res.status(200).json({
      success: true,
      message: "Address info find successfully.",
      data: { address: addressInfo.toObject({ getters: true }) },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addNewAddress,
  getUserAddress,
  deleteAddress,
  updateAddress,
  updateIsDefault,
  findAddressById,
};
