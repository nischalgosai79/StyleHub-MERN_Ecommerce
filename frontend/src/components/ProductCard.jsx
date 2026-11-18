
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  ImageOff,
} from "lucide-react";

import { useStore } from "../context/StoreContext";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();

  const [imageError, setImageError] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  if (!product) return null;

  const productId = product.id || product._id;

  const isFavorite = wishlist.some(
    (item) => item === productId || item?.id === productId || item?._id === productId
  );

  const isOutOfStock = Number(product.stock) <= 0;

  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId || wishlistLoading) return;

    try {
      setWishlistLoading(true);
      await toggleWishlist(productId);
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!productId || isOutOfStock) return;

    addToCart(product);
  };

  return (
    <article className="group min-w-0">

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#eeeae2]">

        <Link to={productId ? `/product/${productId}` : "/shop"}>

          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name || "StyleHub product"}
              onError={() => setImageError(true)}
              loading="lazy"
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
            />
          ) : (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-gray-400 sm:h-72">
              <ImageOff size={40} />
              <span className="text-sm">Image unavailable</span>
            </div>
          )}

        </Link>

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
            New
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || !productId}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:text-red-500 disabled:opacity-50"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-red-500" : ""}
          />
        </button>

        {/* Stock Badge */}
        {isOutOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-2 text-center text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}

        {/* Add to Cart */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-gray-900 shadow transition hover:bg-emerald-700 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ShoppingBag size={17} />
            Add to Cart
          </button>
        )}

      </div>

      {/* Product Information */}
      <div className="pt-4">

        <p className="text-xs uppercase tracking-wider text-gray-500">
          {product.category || "Fashion"}
        </p>

        <Link
          to={productId ? `/product/${productId}` : "/shop"}
          className="mt-1 block truncate font-semibold text-gray-900 hover:text-emerald-700"
        >
          {product.name || "Untitled Product"}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1 text-sm text-amber-500">
          <Star size={15} fill="currentColor" />

          <span className="text-gray-600">
            {product.rating || "New"}
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-center gap-2">

          <span className="font-bold text-gray-900">
            Rs. {Number(product.price || 0).toLocaleString("en-IN")}
          </span>

          {product.oldPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {Number(product.oldPrice).toLocaleString("en-IN")}
            </span>
          )}

        </div>

      </div>

    </article>
  );
};

export default ProductCard;
