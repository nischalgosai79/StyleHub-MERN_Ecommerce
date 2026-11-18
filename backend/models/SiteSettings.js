
import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "StyleHub",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    announcement: {
      type: String,
      default: "Discover the latest styles at StyleHub",
      trim: true,
    },

    heroTitle: {
      type: String,
      default: "Discover Your Style",
      trim: true,
    },

    heroDescription: {
      type: String,
      default: "Explore our latest collection of fashion and accessories.",
      trim: true,
    },

    heroImage: {
      type: String,
      default: "",
      trim: true,
    },

    contactEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    deliveryCharge: {
      type: Number,
      default: 100,
      min: 0,
    },

    freeDeliveryThreshold: {
      type: Number,
      default: 2000,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
