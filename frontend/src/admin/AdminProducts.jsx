
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/productApi";

const initialForm = {
  name: "",
  description: "",
  category: "Men",
  price: "",
  oldPrice: "",
  image: "",
  stock: "",
  sizes: "",
  colors: "",
  featured: true,
  isNew: false,
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Display success/error messages
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch products from backend
  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not load products.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Convert comma-separated values into arrays
  const prepareProductData = () => ({
    ...form,
    price: Number(form.price),
    oldPrice: form.oldPrice === "" ? 0 : Number(form.oldPrice),
    stock: Number(form.stock),
    sizes: form.sizes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    colors: form.colors
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (Number(form.price) <= 0) {
      showMessage("Product price must be greater than zero.", "error");
      return;
    }

    if (Number(form.stock) < 0) {
      showMessage("Stock cannot be negative.", "error");
      return;
    }

    if (form.oldPrice && Number(form.oldPrice) < Number(form.price)) {
      showMessage(
        "Old price should be greater than or equal to the current price.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const productData = prepareProductData();

      if (editingId) {
        await updateProduct(editingId, productData);
        showMessage("Product updated successfully.");
      } else {
        await createProduct(productData);
        showMessage("Product added successfully.");
      }

      setForm(initialForm);
      setEditingId(null);

      await loadProducts();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not save product.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Load product information into the form
  const handleEdit = (product) => {
    setEditingId(product.id || product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Men",
      price: product.price ?? "",
      oldPrice: product.oldPrice || "",
      image: product.image || "",
      stock: product.stock ?? "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "",
      featured: Boolean(product.featured),
      isNew: Boolean(product.isNew),
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setMessage("");
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );

      if (editingId === id) {
        handleCancelEdit();
      }

      showMessage("Product deleted successfully.");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not delete product.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search and filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-NP")}`;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Store Management
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Manage Products
        </h1>

        <p className="mt-2 text-gray-500">
          Add, edit, delete and manage your StyleHub products.
        </p>
      </div>

      {/* Product form */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          {/* Product name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Product Name *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={inputClass}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Category *
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Current Price (Rs.) *
            </label>

            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              className={inputClass}
              required
            />
          </div>

          {/* Old price */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Old Price (Optional)
            </label>

            <input
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.oldPrice}
              onChange={handleChange}
              placeholder="Enter previous price"
              className={inputClass}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Stock Quantity *
            </label>

            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              placeholder="Available quantity"
              className={inputClass}
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Product Image URL *
            </label>

            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className={inputClass}
              required
            />
          </div>

          {/* Image preview */}
          {form.image && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-semibold">Image Preview</p>

              <img
                src={form.image}
                alt="Product preview"
                className="h-36 w-36 rounded-xl border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Sizes */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Available Sizes
            </label>

            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL"
              className={inputClass}
            />
          </div>

          {/* Colors */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Available Colors
            </label>

            <input
              name="colors"
              value={form.colors}
              onChange={handleChange}
              placeholder="Black, White, Blue"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">
              Product Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write product description..."
              rows="4"
              className={inputClass}
              required
            />
          </div>

          {/* Featured */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-4">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 accent-emerald-700"
            />

            <span className="text-sm font-medium">
              Show as Featured Product
            </span>
          </label>

          {/* New arrival */}
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-4">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="h-4 w-4 accent-emerald-700"
            />

            <span className="text-sm font-medium">
              Mark as New Arrival
            </span>
          </label>

          {/* Submit */}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-700 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border px-7 py-3 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Feedback message */}
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

      {/* Product list */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Existing Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* Search and category filter */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name or category..."
            className={inputClass}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p className="font-semibold text-gray-700">
              No products found.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />

                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">{product.category}</td>

                    <td className="p-4 font-semibold">
                      {formatPrice(product.price)}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          product.stock <= 5
                            ? "font-semibold text-red-600"
                            : "text-gray-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                            Featured
                          </span>
                        )}

                        {product.isNew && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            New
                          </span>
                        )}

                        {product.stock === 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="font-semibold text-emerald-700 hover:text-emerald-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={() => handleDelete(product.id)}
                          className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {deletingId === product.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProducts;
