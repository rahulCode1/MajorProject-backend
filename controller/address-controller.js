const { validationResult } = require("express-validator")
const Address = require("../model/user-address-model")
const HttpError = require("../model/http-error")
const User = require("../model/user-model");
const { default: mongoose } = require("mongoose");

// Add New Address
const addNewAddress = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        throw new HttpError("Invalid inputs passed, please check your data.", 422)
    }
    const { name, phoneNumber, area, city, fullAddress, state, zipCode, userId } = req.body;


    const address = new Address({ name, phoneNumber, area, city, fullAddress, state, zipCode, userId });

    let user;

    try {
        user = await User.findById(userId)

    } catch (error) {
        return next(new HttpError("Failed to find user by id while place order.", 500))
    }

    if (!user) {
        return next(new HttpError("Couldn't find user for provided id.", 500))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await address.save({ session: sess })
        user.address.push(address)
        await user.save({ session: sess })
        await sess.commitTransaction()

    } catch (error) {
        next(error);
    }

    res.status(200).json({ message: "New address added successfully.", data: { address: address.toObject({ getters: true }) } });
};

// Get user Addresses
const getUserAddress = async (req, res, next) => {
    const userId = req.params.id
    if (!userId) {
        return next(new HttpError("Please provide user id to delete address.", 404))
    }
    let userWithAddress
    try {
        userWithAddress = await User.findById(userId).populate("address")
    } catch (error) {
        next(new HttpError("Fetching address failed, Please try again later.", 500));
    }

    if (!userWithAddress || userWithAddress.length === 0) {
        return next(new HttpError("This user doesn't have any address.", 404))
    }

    res.status(200).json({ message: "User address find successfully.", data: { address: userWithAddress.address.map(add => add.toObject({ getters: true })) } })

};

// Delete Address
const deleteAddress = async (req, res, next) => {
    const addressId = req.params.id;

    if (!addressId) {
        return next(new HttpError("Please provide address id.", 404))
    }

    try {
        const findAddress = await Address.findById(addressId).populate("userId")
        if (!findAddress) {
            return next(new HttpError("Address not found with provided id.", 404))
        }

        const sess = await mongoose.startSession()
        sess.startTransaction()
        await findAddress.deleteOne({ session: sess })
        findAddress.userId.address.pull(findAddress)
        await findAddress.userId.save({ session: sess })
        await sess.commitTransaction()
    } catch (error) {
        next(error);
    }

    res.status(200).json({ success: true, message: "Address removed successfully." })
};

const updateAddress = async (req, res, next) => {
    const addressId = req.params.id

    if (!addressId) {
        return next(new HttpError("Please provide address id to update address.", 404))
    }
    const updateData = req.body
    try {

        const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, { new: true })

        if (updatedAddress) {
            res.status(200).json({ success: true, message: "Address update successfully", data: { address: updatedAddress.toObject({ getters: true }) } })
        } else {
            return next(new HttpError("No address found for update.", 404))
        }
    } catch (error) {
        next(error)
    }
}

const updateIsDefault = async (req, res, next) => {
    const addressId = req.params.id

    if (!addressId) {
        return next(new HttpError("Please provide address id to update default address.", 404))
    }


    try {
        await Address.updateMany({}, { isDefault: false })
        const updatedAddressStatus = await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true })

        console.log(updateAddress)
        if (updatedAddressStatus) {
            res.status(200).json({ success: true, message: "Address status update successfully", data: { address: updatedAddressStatus.toObject({ getters: true }) } })
        } else {
            return next(new HttpError("No address found for update status.", 404))
        }
    } catch (error) {
        next(error)
    }

}

const findAddressById = async (req, res, next) => {
    const addressId = req.params.id

    if (!addressId) {
        return next(new HttpError("Please provide address id to update address.", 404))
    }

    try {

        const addressInfo = await Address.findById(addressId)
        if (addressInfo) {
            res.status(200).json({ success: true, message: "Address info find successfully.", data: { address: addressInfo.toObject({ getters: true }) } })
        } else {
            return next(new HttpError("Address not found with that id.", 404))
        }
    } catch (error) {
        return next(error)
    }
}


module.exports = {
    addNewAddress,
    getUserAddress,
    deleteAddress,
    updateAddress,
    updateIsDefault,
    findAddressById
};
