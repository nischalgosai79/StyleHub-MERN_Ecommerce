import User from "../models/User.js";
import Product from "../models/Product.js";

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist");

    res.json({
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.some((id) => id.equals(product._id))) {
      return res.status(409).json({
        message: "Product is already in your wishlist.",
      });
    }

    user.wishlist.push(product._id);

    await user.save();

    res.json({
      message: "Product added to wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.json({
      message: "Product removed from wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};