
import { useEffect, useState } from "react";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../api/siteSettingsApi";

const initialSettings = {
  storeName: "StyleHub",
  logo: "",
  announcement: "",
  heroTitle: "",
  heroDescription: "",
  heroImage: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  deliveryCharge: 100,
  freeDeliveryThreshold: 2000,
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const AdminSettings = () => {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load settings from MongoDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();

        setForm({
          ...initialSettings,
          ...data,
        });
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Could not load store settings."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save settings
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (Number(form.deliveryCharge) < 0 ||
        Number(form.freeDeliveryThreshold) < 0) {
      setMessage("Delivery amounts cannot be negative.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const settingsData = {
        ...form,
        deliveryCharge: Number(form.deliveryCharge),
        freeDeliveryThreshold: Number(
          form.freeDeliveryThreshold
        ),
      };

      const updatedSettings =
        await updateSiteSettings(settingsData);

      setForm({
        ...initialSettings,
        ...updatedSettings,
      });

      setMessage("Store settings saved successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not save store settings."
      );
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
        Loading store settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Store Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Store Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your StyleHub branding, homepage, contact
          information and delivery settings.
        </p>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role="status"
          className={`rounded-xl p-4 text-sm font-medium ${
            messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Store Branding
          </h2>

          <p className="mb-6 mt-1 text-sm text-gray-500">
            Set your store name and logo.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Store Name *
              </label>

              <input
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                className={inputClass}
                placeholder="StyleHub"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Logo Image URL
              </label>

              <input
                name="logo"
                type="url"
                value={form.logo}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com/logo.png"
              />
            </div>

            {form.logo && (
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-semibold">
                  Logo Preview
                </p>

                <img
                  src={form.logo}
                  alt="Store logo preview"
                  className="h-20 max-w-48 rounded-lg border object-contain p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Announcement */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Announcement Bar
          </h2>

          <p className="mb-6 mt-1 text-sm text-gray-500">
            Set the message displayed at the top of your website.
          </p>

          <label className="mb-2 block text-sm font-semibold">
            Announcement Message
          </label>

          <input
            name="announcement"
            value={form.announcement}
            onChange={handleChange}
            className={inputClass}
            placeholder="Free delivery on orders above Rs. 2000!"
          />
        </section>

        {/* Homepage hero */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Homepage Hero Section
          </h2>

          <p className="mb-6 mt-1 text-sm text-gray-500">
            Control the main banner content displayed on your homepage.
          </p>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Hero Heading
              </label>

              <input
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                className={inputClass}
                placeholder="Discover Your Style"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Hero Description
              </label>

              <textarea
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleChange}
                rows="3"
                className={inputClass}
                placeholder="Explore our latest fashion collection..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Hero Banner Image URL
              </label>

              <input
                name="heroImage"
                type="url"
                value={form.heroImage}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {form.heroImage && (
              <div>
                <p className="mb-2 text-sm font-semibold">
                  Banner Preview
                </p>

                <img
                  src={form.heroImage}
                  alt="Homepage banner preview"
                  className="h-52 w-full rounded-xl border object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Contact information */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>

          <p className="mb-6 mt-1 text-sm text-gray-500">
            Update the contact details displayed to customers.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Contact Email
              </label>

              <input
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                className={inputClass}
                placeholder="support@stylehub.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Contact Phone
              </label>

              <input
                name="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+977 98XXXXXXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Store Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className={inputClass}
                placeholder="Enter your store address"
              />
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Delivery Settings
          </h2>

          <p className="mb-6 mt-1 text-sm text-gray-500">
            Configure your delivery charge and free delivery limit.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Delivery Charge (Rs.)
              </label>

              <input
                name="deliveryCharge"
                type="number"
                min="0"
                step="0.01"
                value={form.deliveryCharge}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Free Delivery Threshold (Rs.)
              </label>

              <input
                name="freeDeliveryThreshold"
                type="number"
                min="0"
                step="0.01"
                value={form.freeDeliveryThreshold}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-700 px-8 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Settings..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
