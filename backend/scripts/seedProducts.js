
import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const products = [
  // =========================
  // MEN
  // =========================
  {
    name: "Classic Oversized T-Shirt",
    description: "Premium cotton oversized t-shirt for everyday comfort.",
    category: "Men",
    price: 1299,
    oldPrice: 1599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Grey"],
    stock: 30,
    rating: 4.5,
    isNew: true,
    featured: true,
  },
  {
    name: "Premium Denim Jacket",
    description: "Stylish denim jacket suitable for everyday fashion.",
    category: "Men",
    price: 3499,
    oldPrice: 3999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Black"],
    stock: 15,
    rating: 4.6,
    isNew: false,
    featured: true,
  },
  {
    name: "Casual Men's Hoodie",
    description: "Comfortable everyday hoodie with a relaxed fit.",
    category: "Men",
    price: 2299,
    oldPrice: 2799,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Grey", "Green"],
    stock: 22,
    rating: 4.6,
    isNew: true,
    featured: true,
  },
  {
    name: "Slim Fit Casual Shirt",
    description: "A versatile casual shirt perfect for everyday outfits.",
    category: "Men",
    price: 1899,
    oldPrice: 2299,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Black"],
    stock: 24,
    rating: 4.4,
    isNew: true,
    featured: false,
  },
  {
    name: "Men's Slim Fit Jeans",
    description: "Modern slim fit denim jeans with a comfortable stretch.",
    category: "Men",
    price: 2799,
    oldPrice: 3299,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    stock: 20,
    rating: 4.7,
    isNew: false,
    featured: true,
  },

  // =========================
  // WOMEN
  // =========================
  {
    name: "Women's Summer Dress",
    description: "Elegant and comfortable summer dress for casual occasions.",
    category: "Women",
    price: 2499,
    oldPrice: 2999,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800",
    sizes: ["S", "M", "L"],
    colors: ["Pink", "White", "Blue"],
    stock: 20,
    rating: 4.8,
    isNew: true,
    featured: true,
  },
  {
    name: "Women's Casual Top",
    description: "Minimal casual top made with soft and breathable fabric.",
    category: "Women",
    price: 1599,
    oldPrice: 1899,
    image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    stock: 25,
    rating: 4.4,
    isNew: true,
    featured: false,
  },
  {
    name: "Elegant Women's Blazer",
    description: "A modern tailored blazer for formal and smart casual looks.",
    category: "Women",
    price: 3299,
    oldPrice: 3799,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Brown"],
    stock: 14,
    rating: 4.6,
    isNew: true,
    featured: true,
  },
  {
    name: "Women's Casual Jeans",
    description: "Comfortable high-waisted denim jeans for everyday styling.",
    category: "Women",
    price: 2599,
    oldPrice: 2999,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    sizes: ["26", "28", "30", "32"],
    colors: ["Blue", "Black"],
    stock: 19,
    rating: 4.5,
    isNew: false,
    featured: false,
  },
  {
    name: "Floral Midi Dress",
    description: "Beautiful floral midi dress for outings and special occasions.",
    category: "Women",
    price: 2899,
    oldPrice: 3499,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
    sizes: ["S", "M", "L"],
    colors: ["Pink", "Cream", "Green"],
    stock: 17,
    rating: 4.8,
    isNew: true,
    featured: true,
  },

  // =========================
  // SHOES
  // =========================
  {
    name: "Classic White Sneakers",
    description: "Versatile white sneakers for casual and everyday wear.",
    category: "Shoes",
    price: 2999,
    oldPrice: 3599,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["White", "Red"],
    stock: 18,
    rating: 4.7,
    isNew: true,
    featured: true,
  },
  {
    name: "Premium Casual Sneakers",
    description: "Comfortable everyday sneakers with a modern design.",
    category: "Shoes",
    price: 3499,
    oldPrice: 3999,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800",
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["White", "Black"],
    stock: 16,
    rating: 4.6,
    isNew: true,
    featured: false,
  },

  // =========================
  // ACCESSORIES
  // =========================
  {
    name: "Leather Crossbody Bag",
    description: "Modern crossbody bag with a clean and elegant design.",
    category: "Accessories",
    price: 2199,
    oldPrice: 2599,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    sizes: ["One Size"],
    colors: ["Brown", "Black"],
    stock: 12,
    rating: 4.5,
    isNew: false,
    featured: false,
  },
  {
    name: "Women's Fashion Handbag",
    description: "Stylish handbag for everyday use and special occasions.",
    category: "Accessories",
    price: 2799,
    oldPrice: 3299,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Cream"],
    stock: 16,
    rating: 4.8,
    isNew: false,
    featured: true,
  },
  {
    name: "Classic Wrist Watch",
    description: "Minimal wristwatch with a timeless and elegant design.",
    category: "Accessories",
    price: 1999,
    oldPrice: 2499,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
    sizes: ["One Size"],
    colors: ["Black", "Silver", "Brown"],
    stock: 21,
    rating: 4.5,
    isNew: true,
    featured: true,
  },
  {
    name: "Minimalist Sunglasses",
    description: "Stylish sunglasses designed to complete your everyday look.",
    category: "Accessories",
    price: 1299,
    oldPrice: 1599,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
    stock: 28,
    rating: 4.4,
    isNew: false,
    featured: false,
  },
];

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for product seeding...");

    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        { $set: product },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const totalProducts = await Product.countDocuments();

    console.log(`${products.length} StyleHub products processed successfully!`);
    console.log(`Total products in database: ${totalProducts}`);

  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
