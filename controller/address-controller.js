const Address = require("../model/user-address-model")
const HttpError = require("../model/http-error")

// Add New Address
const addNewAddress = async (req, res, next) => {
    const newAddress = req.body;

    try {
        const address = new Address(newAddress);
        const savedAddress = await address.save();

        res
            .status(200)
            .json({ message: "New address added successfully.", savedAddress });
    } catch (error) {
        next(error);
    }
};

// Get All Addresses
const getAllAddress = async (req, res, next) => {
    try {
        const addressList = await Address.find();

        if (addressList.length !== 0) {




            res.status(200).json({
                success: true,
                message: "All addresses fetched successfully.",
                data: { address: addressList },
            });

        } else {

            throw new HttpError("No address found.", 404)
        }
    } catch (error) {
        next(error);
    }
};

// Delete Address
const deleteAddress = async (req, res, next) => {
    const addressId = req.params.id;

    if (!addressId) {
        return res.status(400).json({ message: "Please provide address id." });
    }

    try {
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (deletedAddress) {
            res.status(200).json({
                success: true,
                message: "Address deleted successfully.",
                deletedAddress,
            });
        } else {
            res
                .status(400)
                .json({ message: "No address found for delete." });
        }
    } catch (error) {
        next(error);
    }
};

const updateAddress = async (req, res, next) => {
    const addressId = req.params.id
    const updateData = req.body


    try {

        const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, { new: true })

        if (updatedAddress) {
            res.status(200).json({ success: true, message: "Address update successfully", data: { updatedAddress } })
        } else {
            res
                .status(400)
                .json({ message: "No address found for update.", data: { updatedAddress } });
        }
    } catch (error) {
        next(error)
    }
}

const addressDetails = async (req, res, next) => {
    const addressId = req.params.id

    if (!addressId) {
        return res.status(400).json({ message: "Please provide address id." })
    }
    try {

        const addressDetails = await Address.findById(addressId)

        if (addressDetails) {
            res.status(200).json({ success: true, message: " Address details fetched successfully.", data: { address: addressDetails } })
        } else {
            res.status(400).json({ message: "No address found.", data: { address: addressDetails } })
        }
    } catch (error) {
        next(error)
    }

}

const updateIsDefault = async (req, res, next) => {
    const addressId = req.params.id



    try {

        await Address.updateMany({}, { isDefault: false })

        const updatedAddressStatus = await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true })





        if (updatedAddressStatus) {
            res.status(200).json({ success: true, message: "Address status update successfully", data: { address: updatedAddressStatus } })
        } else {
            res
                .status(400)
                .json({ message: "No address found for update status.", data: { address: updatedAddressStatus } });
        }
    } catch (error) {
        next(error)
    }

}



module.exports = {
    addNewAddress,
    getAllAddress,
    deleteAddress,
    updateAddress,
    addressDetails,
    updateIsDefault
};
