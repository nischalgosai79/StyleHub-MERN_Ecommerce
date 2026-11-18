
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  CalendarDays,
  CreditCard,
  RefreshCw,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getMyOrders } from "../api/orderApi";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      setOrders(response.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((previous) =>
      previous.includes(orderId)
        ? previous.filter((id) => id !== orderId)
        : [...previous, orderId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] px-4 py-16">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-9 w-48 rounded bg-gray-200" />
          <div className="h-5 w-72 rounded bg-gray-200" />

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Your StyleHub account
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View your purchases and track your order status.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">{error}</p>

            <button
              onClick={fetchOrders}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              You haven't placed any orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Explore our collection and find something you love.
              Your purchases will appear here.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!error && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                You have{" "}
                <span className="font-bold text-gray-900">
                  {orders.length}
                </span>{" "}
                {orders.length === 1 ? "order" : "orders"}.
              </p>

              <button
                onClick={fetchOrders}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                <RefreshCw size={15} />
                Refresh orders
              </button>
            </div>

            {orders.map((order) => {
              const isExpanded = expandedOrders.includes(order._id);
              const status = order.status || "pending";

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {/* Order header */}
                  <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Order ID
                        </p>
                        <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                          #{order._id}
                        </p>
                      </div>

                      <div>
                        <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500">
                          <CalendarDays size={13} />
                          Order date
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Total amount
                        </p>
                        <p className="mt-1 text-sm font-bold text-emerald-700">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                        statusStyles[status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Products preview */}
                  <div className="space-y-4 p-5 sm:px-6">
                    {(order.items || []).slice(0, 2).map((item, index) => (
                      <div
                        key={`${item.product || item.name}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/100x120?text=Product"
                          }
                          alt={item.name || "Product"}
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/100x120?text=Product";
                          }}
                          className="h-20 w-16 rounded-lg bg-gray-100 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                          {(item.size || item.color) && (
                            <p className="mt-1 text-xs text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " · "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>

                        <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(
                            Number(item.price) * Number(item.quantity)
                          )}
                        </p>
                      </div>
                    ))}

                    {order.items?.length > 2 && (
                      <p className="text-sm text-gray-500">
                        + {order.items.length - 2} more products
                      </p>
                    )}
                  </div>

                  {/* Expand details */}
                  <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
                    <button
                      onClick={() => toggleOrder(order._id)}
                      className="flex w-full items-center justify-between text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      {isExpanded ? "Hide order details" : "View order details"}

                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-5 grid gap-6 border-t border-gray-100 pt-5 md:grid-cols-2">
                        {/* All products */}
                        <div>
                          <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                            <Package size={18} />
                            Purchased products
                          </h3>

                          <div className="space-y-3">
                            {(order.items || []).map((item, index) => (
                              <div
                                key={`${item.product || item.name}-${index}`}
                                className="flex justify-between gap-3 text-sm"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.name}
                                  </p>
                                  <p className="text-gray-500">
                                    {item.quantity} × {formatPrice(item.price)}
                                  </p>
                                </div>

                                <p className="font-semibold text-gray-900">
                                  {formatPrice(
                                    Number(item.price) *
                                      Number(item.quantity)
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex justify-between border-t border-gray-200 pt-3 font-bold">
                            <span>Total</span>
                            <span className="text-emerald-700">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Delivery information */}
                        <div className="space-y-5">
                          <div>
                            <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                              <MapPin size={18} />
                              Delivery information
                            </h3>

                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="font-semibold text-gray-900">
                                {order.shippingAddress?.fullName}
                              </p>
                              <p>{order.shippingAddress?.phone}</p>
                              <p>{order.shippingAddress?.email}</p>
                              <p>{order.shippingAddress?.address}</p>
                              <p>
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.province}
                              </p>
                              {order.shippingAddress?.postalCode && (
                                <p>
                                  Postal code:{" "}
                                  {order.shippingAddress.postalCode}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                              <CreditCard size={18} />
                              Payment method
                            </h3>

                            <p className="text-sm text-gray-600">
                              {order.paymentMethod === "COD"
                                ? "Cash on Delivery"
                                : order.paymentMethod}
                            </p>
                          </div>

                          <div>
                            <h3 className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                              <Truck size={18} />
                              Order status
                            </h3>

                            <p className="text-sm capitalize text-gray-600">
                              {status}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
