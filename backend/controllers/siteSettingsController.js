
import SiteSettings from "../models/SiteSettings.js";

// Fields that admins are allowed to update
const allowedFields = [
  "storeName",
  "logo",
  "announcement",
  "heroTitle",
  "heroDescription",
  "heroImage",
  "contactEmail",
  "contactPhone",
  "address",
  "deliveryCharge",
  "freeDeliveryThreshold",
];

// Get store settings (public)
export const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update store settings (admin only)
export const updateSiteSettings = async (req, res, next) => {
  try {
    const updates = {};

    // Only accept approved fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (
      updates.deliveryCharge !== undefined &&
      (!Number.isFinite(Number(updates.deliveryCharge)) ||
        Number(updates.deliveryCharge) < 0)
    ) {
      return res.status(400).json({
        message: "Delivery charge must be a valid non-negative number.",
      });
    }

    if (
      updates.freeDeliveryThreshold !== undefined &&
      (!Number.isFinite(Number(updates.freeDeliveryThreshold)) ||
        Number(updates.freeDeliveryThreshold) < 0)
    ) {
      return res.status(400).json({
        message: "Free delivery threshold must be a valid non-negative number.",
      });
    }

    if (updates.deliveryCharge !== undefined) {
      updates.deliveryCharge = Number(updates.deliveryCharge);
    }

    if (updates.freeDeliveryThreshold !== undefined) {
      updates.freeDeliveryThreshold = Number(
        updates.freeDeliveryThreshold
      );
    }

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Store settings updated successfully.",
      settings,
    });
  } catch (error) {
    next(error);
  }
};
