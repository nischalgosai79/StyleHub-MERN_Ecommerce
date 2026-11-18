
import Product from "../models/Product.js";

// GET /api/products
// Get all products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      sort,
      featured,
    } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    let query = Product.find(filter);

    if (sort === "price-low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-high") {
      query = query.sort({ price: -1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET /api/products/:id
// Get one product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// POST /api/products
// Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// PUT /api/products/:id
// Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE /api/products/:id
// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
