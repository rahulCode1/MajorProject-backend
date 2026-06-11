const Product = require("../model/product-model");
const HttpError = require("../model/http-error");
const cloudinary = require("../config/cloudinary");

const addNewProduct = async (req, res, next) => {
  const {
    name,
    shortDescription,
    description,
    price,
    discountPrice,
    costPrice,
    length,
    width,
    height,
    weight,
    rating,
    materialType,
    category,
    care,
    tags,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new HttpError("No image uploaded.", 400));
  }

  const userId = req.userId;

  const uploadedImages = [];

  try {
    for (file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "products", // Add folder
          resource_type: "auto", // Add resource type
        },
      );

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // In your controller, before creating the product:
    const careArray = Array.isArray(req.body.care)
      ? req.body.care
      : req.body.care
        ? [req.body.care]
        : [];

    const tagsArray = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
        ? [req.body.tags]
        : [];

    const product = new Product({
      name,
      shortDescription,
      description,
      price,
      discountPrice,
      costPrice,
      createdBy: userId,
      length,
      width,
      height,
      weight,
      rating,
      materialType,
      category,
      care: careArray,
      tags: tagsArray,
      images: uploadedImages,
      metaTitle,
      metaDescription,
      keywords,
    });

    const saveProduct = await product.save();

    if (saveProduct) {
      res
        .status(200)
        .json({ message: "New product added successfully.", saveProduct });
    } else {
      return next(new HttpError("No product add.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const productsList = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All product fetched successfully.",
      data: {
        products: productsList.map((product) =>
          product.toObject({ getters: true }),
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const userId = req.userId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError("Product not found.", 404));
    }


    if (product.createdBy.toString() !== userId) {
      return next(
        new HttpError("You are not authorized to delete this product.", 403),
      );
    }

    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const productDetails = async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new HttpError("Please provide product id.", 404));
  }
  try {
    const productDetails = await Product.findById(productId);
    const similarProducts = await Product.find({
      category: productDetails.category,
      _id: { $ne: productDetails._id },
    }).limit(5);

    if (productDetails) {
      res.status(200).json({
        success: true,
        message: " Product details fetched successfully.",
        data: {
          product: productDetails.toObject({ getters: true }),
          similarProducts: similarProducts.map((product) =>
            product.toObject({ getters: true }),
          ),
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
  addNewProduct,
  getAllProducts,
  deleteProduct,
  productDetails,
};
