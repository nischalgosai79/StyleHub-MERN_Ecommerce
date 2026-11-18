
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  Star,
  ImageOff,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { getProductById } from "../api/productApi";
import { useStore } from "../context/StoreContext";

const ProductDetails = () => {
  const { id } = useParams();

  const {
    addToCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  // Fetch product from MongoDB
  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        if (!active) return;

        setProduct(data);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
        setSelectedImage(data.image || data.images?.[0] || "");

        setImageError(false);
        setQuantity(1);
        setCartMessage("");
      } catch (err) {
        if (!active) return;

        console.error("Product loading error:", err);

        setError(
          err.response?.data?.message || "Product not found."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] px-6 py-32">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="h-[450px] rounded-2xl bg-gray-200" />

            <div className="space-y-5 py-8">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/3 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (error || !product) {
    return (
      <section className="min-h-screen bg-[#f8f5ef] px-6 py-32 text-center">
        <ImageOff
          className="mx-auto text-gray-400"
          size={48}
        />

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Product unavailable
        </h2>

        <p className="mt-2 text-gray-500">
          {error || "We couldn't find this product."}
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>
      </section>
    );
  }

  // Product information
  const productId = product.id || product._id;

  const isFavorite = wishlist.some((item) => {
    const wishlistId =
      typeof item === "string"
        ? item
        : item?.id || item?._id;

    return String(wishlistId) === String(productId);
  });

  const stock = Math.max(0, Number(product.stock) || 0);
  const isOutOfStock = stock === 0;

  // Product gallery images
  const images = [
    ...new Set(
      [product.image, ...(product.images || [])].filter(Boolean)
    ),
  ];

  // Calculate discount
  const discount =
    Number(product.oldPrice) > Number(product.price) &&
    Number(product.oldPrice) > 0
      ? Math.round(
          ((Number(product.oldPrice) - Number(product.price)) /
            Number(product.oldPrice)) *
            100
        )
      : 0;

  // Wishlist handler
  const handleWishlist = async () => {
    if (!productId || wishlistLoading) return;

    try {
      setWishlistLoading(true);

      await toggleWishlist(productId);
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Add product to cart
  const handleAddToCart = () => {
    if (isOutOfStock || quantity > stock) return;

    const success = addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    if (success) {
      setCartMessage(
        `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart!`
      );
    } else {
      setCartMessage(
        "Unable to add product. Please check available stock."
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f5ef] px-5 py-12 sm:px-8 md:px-12 lg:px-20">

      {/* Breadcrumb */}
      <div className="mx-auto mb-8 max-w-7xl">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Product Images */}
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-[#eeeae2]">

            {selectedImage && !imageError ? (
              <img
                src={selectedImage}
                alt={product.name}
                onError={() => setImageError(true)}
                className="h-[420px] w-full object-cover sm:h-[550px]"
              />
            ) : (
              <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-gray-400 sm:h-[550px]">
                <ImageOff size={55} />
                <p>Image unavailable</p>
              </div>
            )}

            {/* New Arrival Badge */}
            {product.isNew && (
              <span className="absolute left-5 top-5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white">
                NEW ARRIVAL
              </span>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => {
                    setSelectedImage(image);
                    setImageError(false);
                  }}
                  className={`shrink-0 overflow-hidden rounded-xl border-2 ${
                    selectedImage === image
                      ? "border-emerald-700"
                      : "border-transparent"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="py-2 sm:py-5">

          <p className="text-sm font-semibold uppercase tracking-[3px] text-emerald-700">
            {product.category || "Fashion"}
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-5 flex items-center gap-2">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={17}
                  fill={
                    Number(product.rating) >= star
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <span className="text-sm text-gray-600">
              {product.rating
                ? `${product.rating} / 5`
                : "New product"}
            </span>
          </div>

          {/* Price */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              Rs. {Number(product.price || 0).toLocaleString("en-IN")}
            </span>

            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  Rs. {Number(product.oldPrice).toLocaleString("en-IN")}
                </span>

                <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="mt-7 border-b border-gray-200 pb-7 leading-8 text-gray-600">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 font-semibold text-gray-900">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-emerald-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 font-semibold text-gray-900">
                Select Color
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      selectedColor === color
                        ? "border-emerald-700 bg-emerald-50 font-semibold text-emerald-800"
                        : "border-gray-300 bg-white text-gray-700 hover:border-emerald-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-7">
            {isOutOfStock ? (
              <p className="font-semibold text-red-600">
                Currently out of stock
              </p>
            ) : (
              <p className="text-sm font-medium text-emerald-700">
                {stock} items available
              </p>
            )}
          </div>

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-gray-900">
                Quantity
              </h3>

              <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  disabled={quantity <= 1}
                  className="p-3 transition hover:bg-gray-100 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <span className="min-w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(stock, current + 1)
                    )
                  }
                  disabled={quantity >= stock}
                  className="p-3 transition hover:bg-gray-100 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <ShoppingBag size={19} />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="rounded-full border border-gray-300 bg-white p-4 transition hover:border-red-300 hover:text-red-500 disabled:opacity-50"
              aria-label={
                isFavorite
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                size={21}
                fill={isFavorite ? "currentColor" : "none"}
                className={isFavorite ? "text-red-500" : ""}
              />
            </button>
          </div>

          {/* Cart Message */}
          {cartMessage && (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              {cartMessage}
            </p>
          )}

          {/* Additional Information */}
          <div className="mt-8 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-500">
            <p>✓ Quality fashion products</p>
            <p>✓ Secure order processing</p>
            <p>✓ Multiple sizes and colors where available</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
