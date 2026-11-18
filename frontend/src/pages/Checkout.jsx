
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  Truck,
  ArrowLeft,
} from "lucide-react";

import { createOrder } from "../api/orderApi";
import { useStore } from "../context/StoreContext";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useStore();

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // Format prices
  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Validate delivery information
  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "province",
      "postalCode",
    ];

    for (const field of requiredFields) {
      if (!String(form[field]).trim()) {
        return "Please fill in all delivery information.";
      }
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return "Please enter a valid phone number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Validate product IDs
    const invalidItem = cart.find(
      (item) =>
        !(item.id || item._id || item.productId) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
    );

    if (invalidItem) {
      setError(
        "A product in your cart has invalid information. Please remove it and add it again."
      );
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id || item._id || item.productId,
          quantity: Number(item.quantity),
          size: item.size || "",
          color: item.color || "",
        })),

        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          postalCode: form.postalCode.trim(),
        },

        paymentMethod: "COD",
      };

      await createOrder(orderData);

      // Clear cart only after successful order creation
      clearCart();

      navigate("/my-orders", {
        replace: true,
        state: {
          message: "Your order was placed successfully!",
        },
      });
    } catch (err) {
      console.error("Order placement error:", err);

      setError(
        err.response?.data?.message ||
          "Could not place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart
  if (!cart.length) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <ShoppingBag
            size={55}
            className="mx-auto mb-5 text-gray-300"
          />

          <h2 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-3 text-gray-500">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  // Form fields
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter your phone number",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "example@email.com",
    },
    {
      name: "address",
      label: "Street Address",
      type: "text",
      placeholder: "House number, street, area",
      fullWidth: true,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      name: "province",
      label: "Province",
      type: "text",
      placeholder: "Enter your province",
    },
    {
      name: "postalCode",
      label: "Postal Code",
      type: "text",
      placeholder: "Enter postal code",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8f5ef] px-4 py-12 sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-9">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your delivery information to place your order.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">

          {/* Delivery Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Information
                </h2>

                <p className="text-sm text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className={
                    field.fullWidth ? "sm:col-span-2" : ""
                  }
                >
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    {field.label}
                    <span className="text-red-500"> *</span>
                  </span>

                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    autoComplete={
                      field.name === "fullName"
                        ? "name"
                        : field.name === "email"
                          ? "email"
                          : field.name === "phone"
                            ? "tel"
                            : field.name === "address"
                              ? "street-address"
                              : "off"
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              ))}
            </div>

            {/* Payment method */}
            <div className="mt-9">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="rounded-xl border-2 border-emerald-600 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-3 text-emerald-700">
                    <Truck size={22} />
                  </div>

                  <div>
                    <p className="font-semibold text-emerald-900">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm text-emerald-700">
                      Pay when your order arrives.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="mt-8 w-full rounded-full bg-emerald-700 py-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Placing Your Order..."
                : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Your order will be processed after confirmation.
            </p>
          </form>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900">
              Your Order
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {cart.length} {cart.length === 1 ? "product" : "products"}
            </p>

            {/* Products */}
            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex gap-3"
                >
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/100x120?text=StyleHub"
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x120?text=Image";
                    }}
                    className="h-20 w-16 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Size: {item.size || "N/A"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Color: {item.color || "N/A"}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(
                      Number(item.price) * Number(item.quantity)
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-200" />

            {/* Price details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>Calculated by store</span>
              </div>
            </div>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Estimated Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              Final delivery charges will be confirmed by the store.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
