
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const {
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }

    navigate("/checkout");
  };

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;

  return (
    <section className="min-h-screen bg-[#f8f5ef] px-4 py-12 sm:px-6 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <ShoppingBag
              size={55}
              className="mx-auto mb-5 text-gray-300"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-block rounded-full bg-emerald-700 px-8 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">

            {/* Cart items */}
            <div className="space-y-5">
              {cart.map((item) => {
                const stockAvailable =
                  item.stock !== undefined && item.stock !== null;

                const isAtStockLimit =
                  stockAvailable &&
                  item.quantity >= Number(item.stock);

                const itemTotal =
                  Number(item.price || 0) * item.quantity;

                return (
                  <div
                    key={item.cartKey}
                    className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    {/* Product image */}
                    <Link
                      to={`/product/${item.id || item._id}`}
                      className="shrink-0"
                    >
                      <img
                        src={
                          item.image ||
                          "https://placehold.co/300x400?text=StyleHub"
                        }
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/300x400?text=Image+Unavailable";
                        }}
                        className="h-32 w-full rounded-xl object-cover sm:w-28"
                      />
                    </Link>

                    {/* Product information */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.id || item._id}`}
                        className="font-semibold text-gray-900 hover:text-emerald-700"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-2 text-sm text-gray-500">
                        Size: {item.size || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Color: {item.color || "N/A"}
                      </p>

                      <p className="mt-2 font-semibold text-emerald-800">
                        {formatPrice(item.price)}
                      </p>

                      {stockAvailable && (
                        <p className="mt-1 text-xs text-gray-500">
                          {Number(item.stock) > 0
                            ? `${item.stock} available`
                            : "Out of stock"}
                        </p>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cartKey,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="rounded-full border border-gray-300 p-2 transition hover:bg-gray-100 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-5 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cartKey,
                              item.quantity + 1
                            )
                          }
                          disabled={isAtStockLimit}
                          className="rounded-full border border-gray-300 p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Item total and remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">
                          {formatPrice(itemTotal)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="text-red-500 transition hover:text-red-700"
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <aside className="rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="mt-3 flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-sm">At checkout</span>
              </div>

              <div className="my-5 border-t border-gray-200" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-7 w-full rounded-full bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-800"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="mt-4 block text-center text-sm font-medium text-gray-500 hover:text-emerald-700"
              >
                Continue Shopping
              </Link>

              <p className="mt-5 text-center text-xs text-gray-400">
                Secure checkout with StyleHub
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
