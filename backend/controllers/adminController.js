import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      revenueResult,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
      Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      totalRevenue: revenueResult[0]?.revenue || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};