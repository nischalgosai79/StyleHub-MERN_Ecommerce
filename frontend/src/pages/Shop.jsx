
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Men", "Women", "Shoes", "Accessories"];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [sort, setSort] = useState("default");

  // Fetch products from MongoDB
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Synchronize filters when URL changes
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "All";
    const urlSearch = searchParams.get("search") || "";

    setCategory(
      categories.includes(urlCategory) ? urlCategory : "All"
    );
    setSearch(urlSearch);
  }, [searchParams]);

  // Update URL without losing other filters
  const updateUrl = (newCategory, newSearch) => {
    const params = {};

    if (newCategory !== "All") {
      params.category = newCategory;
    }

    if (newSearch.trim()) {
      params.search = newSearch.trim();
    }

    setSearchParams(params);
  };

  // Search handler
  const handleSearch = (value) => {
    setSearch(value);
    updateUrl(category, value);
  };

  // Category handler
  const handleCategory = (value) => {
    setCategory(value);
    updateUrl(value, search);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filtering
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // Search filtering
    if (search.trim()) {
      const term = search.trim().toLowerCase();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term)
        );
      });
    }

    // Sorting
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, category, search, sort]);

  // Reset all filters
  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setSort("default");
    setSearchParams({});
  };

  const hasActiveFilters =
    category !== "All" || search.trim() !== "" || sort !== "default";

  return (
    <section className="min-h-screen bg-[#f8f5ef] px-5 py-12 sm:px-8 md:px-12 lg:px-20">

      {/* Page Heading */}
      <div className="mb-10 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
          Discover your style
        </p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
          Shop Collection
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-gray-500">
          Explore our latest fashion collection and discover
          something that matches your style.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-[#f8f5ef] py-3 pl-11 pr-10 outline-none transition focus:border-emerald-600"
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => handleCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-[#f8f5ef] px-4 py-3 outline-none focus:border-emerald-600"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#f8f5ef] py-3 pl-9 pr-4 outline-none focus:border-emerald-600"
            >
              <option value="default">Default Sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

        </div>

        {/* Category Quick Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-emerald-700 text-white"
                  : "bg-[#f8f5ef] text-gray-600 hover:bg-emerald-100 hover:text-emerald-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {category === "All" ? "All Products" : category}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredProducts.length} products found
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Clear all filters
          </button>
        )}

      </div>

      {/* Loading State */}
      {loading ? (

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="mt-4 h-3 w-1/3 rounded bg-gray-200" />
              <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>

      ) : error ? (

        /* Error State */
        <div className="rounded-2xl bg-white py-20 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Unable to load products
          </h2>

          <p className="mt-2 text-gray-500">{error}</p>

          <button
            type="button"
            onClick={loadProducts}
            className="mt-5 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Try Again
          </button>
        </div>

      ) : filteredProducts.length === 0 ? (

        /* Empty State */
        <div className="rounded-2xl bg-white py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            No matching products found
          </h2>

          <p className="mt-2 text-gray-500">
            Try another search or select a different category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Clear Filters
          </button>
        </div>

      ) : (

        /* Product Grid */
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
            />
          ))}

        </div>

      )}

    </section>
  );
};

export default Shop;
