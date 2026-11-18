import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Customer creates an order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "province",
    ];

    if (
      !shippingAddress ||
      requiredFields.some(
        (field) => !shippingAddress[field]?.toString().trim()
      )
    ) {
      return res.status(400).json({
        message: "Please provide complete delivery information.",
      });
    }

    if (paymentMethod && paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Currently only Cash on Delivery is supported.",
      });
    }

    const orderItems = [];
    const stockChanges = new Map();
    let totalAmount = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
      ) {
        return res.status(400).json({
          message: "Invalid product quantity.",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      const alreadyRequested = stockChanges.get(product._id.toString()) || 0;
      const requestedQuantity = alreadyRequested + quantity;

      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} has insufficient stock.`,
        });
      }

      if (
        product.sizes.length > 0 &&
        !product.sizes.includes(item.size)
      ) {
        return res.status(400).json({
          message: `Please select a valid size for ${product.name}.`,
        });
      }

      if (
        product.colors.length > 0 &&
        !product.colors.includes(item.color)
      ) {
        return res.status(400).json({
          message: `Please select a valid color for ${product.name}.`,
        });
      }

      stockChanges.set(product._id.toString(), requestedQuantity);

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size: item.size || "",
        color: item.color || "",
      });

      totalAmount += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      totalAmount,
    });

    // Reduce stock after the order has been created.
    for (const [productId, quantity] of stockChanges) {
      const updatedProduct = await Product.updateOne(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        }
      );

      if (updatedProduct.modifiedCount !== 1) {
        throw new Error("Stock changed during checkout. Please try again.");
      }
    }

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Customer gets their orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin gets all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin updates order status
export const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({
        message: "This order can no longer be updated.",
      });
    }

    if (status === "cancelled") {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
      }
    }

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated.",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};