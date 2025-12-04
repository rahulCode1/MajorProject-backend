const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        shortDescription: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, required: true, min: 0 },
        costPrice: { type: Number, required: true, min: 0 },

        // Dimensions
        length: { type: Number, required: true, min: 0 },
        width: { type: Number, required: true, min: 0 },
        height: { type: Number, required: true, min: 0 },
        weight: { type: Number, required: true, min: 0 },

        // Product details
        materialType: {
            type: String,
            required: true,
            enum: ['WhiteMarble', 'BlackMarble', 'GreenMarble', 'PinkMarble', 'Granite', 'Sandstone']
        },
        care: { type: [String], required: true },
        category: {
            type: String,
            required: true,
            enum: ['StatuesIdols', 'HomeDecor', 'KitchenDining', 'GardenOutdoor', 'CorporateGifts', 'ReligiousItems']
        },
        tags: { type: [String], required: true },

        // Images - changed to array for multiple images
        image: { type: String, required: true }, // Keep as single for now if that's your requirement

        // SEO
        metaTitle: { type: String, required: true, maxlength: 60 },
        metaDescription: { type: String, required: true, maxlength: 160 },
        keywords: { type: String, required: true },
        createdBy: {type: mongoose.Types.ObjectId, ref: "User"}

    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

const Product = mongoose.model("Product", productModel);
module.exports = Product;