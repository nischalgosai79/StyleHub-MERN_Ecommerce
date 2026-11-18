
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Fetch all orders
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load customer orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Search and filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName =
        order.shippingAddress?.fullName ||
        order.user?.name ||
        "";

      const email =
        order.shippingAddress?.email ||
        order.user?.email ||
        "";

      const orderId = order._id || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        customerName.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        orderId.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Open order details
  const openOrder = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setSuccess("");
    setError("");
  };

  // Update order status
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) return;

    if (selectedStatus === selectedOrder.status) {
      return;
    }

    if (selectedOrder.status === "delivered" ||
        selectedOrder.status === "cancelled") {
      setError("This order can no longer be updated.");
      return;
    }

    if (selectedStatus === "cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? Product stock will be restored."
      );

      if (!confirmed) return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateOrderStatus(
        selectedOrder._id,
        selectedStatus
      );

      setSuccess("Order status updated successfully.");

      await loadOrders();

      setSelectedOrder((previous) =>
        previous
          ? { ...previous, status: selectedStatus }
          : null
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  const summaryCards = [
    {
      label: "Total Orders",
      value: orders.length,
    },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
    },
    {
      label: "Processing",
      value: orders.filter((o) =>
        ["confirmed", "processing"].includes(o.status)
      ).length,
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage customer orders and track deliveries.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-emerald-800">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Error and success messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row">
        <input
          type="text"
          placeholder="Search by order ID, customer or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600 md:flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
        >
          <option value="all">All Orders</option>

          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-900">
            Customer Orders ({filteredOrders.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold text-gray-800">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {order.shippingAddress?.fullName ||
                          order.user?.name ||
                          "Customer"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.shippingAddress?.email ||
                          order.user?.email ||
                          ""}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatPrice(order.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => openOrder(order)}
                        className="font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white">

            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  #{selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Customer information */}
              <section>
                <h3 className="mb-3 font-bold text-gray-900">
                  Customer Information
                </h3>

                <div className="grid gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                  <p>
                    <span className="text-gray-500">Name:</span>{" "}
                    {selectedOrder.shippingAddress?.fullName}
                  </p>

                  <p>
                    <span className="text-gray-500">Phone:</span>{" "}
                    {selectedOrder.shippingAddress?.phone}
                  </p>

                  <p>
                    <span className="text-gray-500">Email:</span>{" "}
                    {selectedOrder.shippingAddress?.email}
                  </p>

                  <p>
                    <span className="text-gray-500">Date:</span>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </section>

              {/* Delivery information */}
              <section>
                <h3 className="mb-3 font-bold text-gray-900">
                  Delivery Address
                </h3>

                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {selectedOrder.shippingAddress?.address},{" "}
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.province}

                  {selectedOrder.shippingAddress?.postalCode &&
                    `, ${selectedOrder.shippingAddress.postalCode}`}
                </div>
              </section>

              {/* Purchased products */}
              <section>
                <h3 className="mb-3 font-bold text-gray-900">
                  Ordered Products
                </h3>

                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${item.product || item.name}-${index}`}
                      className="flex gap-4 rounded-xl border border-gray-100 p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}

                        {item.color && (
                          <p className="text-sm text-gray-500">
                            Color: {item.color}
                          </p>
                        )}

                        <p className="mt-2 font-bold text-emerald-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment and total */}
              <section className="rounded-xl bg-gray-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="font-semibold">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="font-bold text-gray-900">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-emerald-800">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </section>

              {/* Update order status */}
              <section>
                <h3 className="mb-3 font-bold text-gray-900">
                  Update Order Status
                </h3>

                {["delivered", "cancelled"].includes(
                  selectedOrder.status
                ) ? (
                  <p className="rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
                    This order is {selectedOrder.status} and can no longer be updated.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                    >
                      {STATUSES.filter(
                        (status) => status !== "cancelled"
                      ).map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() +
                            status.slice(1)}
                        </option>
                      ))}

                      <option value="cancelled">
                        Cancel Order
                      </option>
                    </select>

                    <button
                      onClick={handleStatusUpdate}
                      disabled={
                        saving ||
                        selectedStatus === selectedOrder.status
                      }
                      className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
