
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  addToWishlist as apiAddWishlist,
  getWishlist,
  removeFromWishlist as apiRemoveWishlist,
} from "../api/wishlistApi";

const StoreContext = createContext();

const readCart = () => {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("stylehub-cart")
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch {
    return [];
  }
};

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState(readCart);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("stylehub-cart", JSON.stringify(cart));
  }, [cart]);

  // Load wishlist from MongoDB
  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      setWishlistLoading(true);

      try {
        const data = await getWishlist();

        const products = data.wishlist || data.products || [];

        if (!cancelled) {
          setWishlist(
            products
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item._id || item.id
              )
              .filter(Boolean)
              .map(String)
          );
        }
      } catch (error) {
        console.error("Wishlist loading failed:", error);
      } finally {
        if (!cancelled) {
          setWishlistLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Add product to cart
  const addToCart = (product, options = {}) => {
    const productId =
      product.id || product._id || product.productId;

    if (!productId) {
      console.error("Product ID is missing:", product);
      return false;
    }

    const size =
      options.size ?? product.sizes?.[0] ?? "";

    const color =
      options.color ?? product.colors?.[0] ?? "";

    const requestedQuantity = Math.max(
      1,
      Math.floor(Number(options.quantity) || 1)
    );

    const stock = Number(product.stock);
    const hasStockLimit =
      product.stock !== undefined &&
      product.stock !== null &&
      Number.isFinite(stock);

    if (hasStockLimit && stock <= 0) {
      return false;
    }

    const cartKey = `${productId}-${size}-${color}`;

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.cartKey === cartKey
      );

      const currentQuantity = existing
        ? Number(existing.quantity) || 0
        : 0;

      let newQuantity = currentQuantity + requestedQuantity;

      if (hasStockLimit) {
        newQuantity = Math.min(newQuantity, stock);
      }

      if (existing) {
        return previous.map((item) =>
          item.cartKey === cartKey
            ? {
                ...item,
                ...product,
                id: String(productId),
                size,
                color,
                cartKey,
                stock: product.stock,
                quantity: newQuantity,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          ...product,
          id: String(productId),
          size,
          color,
          cartKey,
          quantity: newQuantity,
        },
      ];
    });

    return true;
  };

  // Remove product from cart
  const removeFromCart = (cartKey) => {
    setCart((previous) =>
      previous.filter((item) => item.cartKey !== cartKey)
    );
  };

  // Update product quantity
  const updateQuantity = (cartKey, quantity) => {
    const requestedQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
      return;
    }

    setCart((previous) =>
      previous.map((item) => {
        if (item.cartKey !== cartKey) {
          return item;
        }

        const stock = Number(item.stock);

        const hasStockLimit =
          item.stock !== undefined &&
          item.stock !== null &&
          Number.isFinite(stock);

        if (hasStockLimit && stock <= 0) {
          return item;
        }

        return {
          ...item,
          quantity: hasStockLimit
            ? Math.min(requestedQuantity, stock)
            : requestedQuantity,
        };
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Add or remove wishlist product
  const toggleWishlist = async (productId) => {
    if (!user) {
      throw new Error("Please log in to use your wishlist.");
    }

    const id = String(productId);

    const alreadyExists = wishlist.includes(id);

    // Optimistic UI update
    setWishlist((previous) =>
      alreadyExists
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );

    try {
      if (alreadyExists) {
        await apiRemoveWishlist(id);
      } else {
        await apiAddWishlist(id);
      }
    } catch (error) {
      // Restore previous state if API request fails
      setWishlist((previous) =>
        alreadyExists
          ? [...previous, id]
          : previous.filter((item) => item !== id)
      );

      throw error;
    }
  };

  // Total number of products
  const cartCount = cart.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );

  // Total cart price
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        wishlistLoading,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
