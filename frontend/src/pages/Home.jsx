
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-72 rounded-2xl bg-gray-200" />
    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
    <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Backend returns all products sorted by newest first.
      const data = await getProducts({ sort: "newest" });

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Homepage products error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, refresh]);

  // Products marked as featured in MongoDB.
  const featuredProducts = products
    .filter((product) => product.featured === true)
    .slice(0, 4);

  // Latest products. Backend already sorts by newest.
  const latestProducts = products.slice(0, 4);

  // Generate categories from database products.
  const categories = [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Use the first product image for the hero when available.
  const heroImage =
    products.find((product) => product.image)?.image ||
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200";

  return (
    <main className="bg-[#f8f5ef]">

      {/* HERO SECTION */}
      <section className="grid min-h-[580px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-16 lg:px-24">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            New season collection
          </p>

          <h1 className="max-w-xl text-5xl font-bold leading-tight text-gray-900 md:text-7xl">
            Wear your style. Own your story.
          </h1>

          <p className="mt-6 max-w-lg leading-7 text-gray-600">
            Discover clothing, shoes and accessories designed
            to make every day feel special.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-emerald-700 px-8 py-4 font-semibold text-white transition hover:bg-emerald-800"
          >
            Shop Collection
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gray-200">
          <img
            src={heroImage}
            alt="StyleHub fashion collection"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200";
            }}
            className="h-[450px] w-full object-cover md:h-[540px]"
          />
        </div>
      </section>

      {/* DYNAMIC CATEGORIES */}
      {!loading && !error && categories.length > 0 && (
        <section className="px-6 pb-10 md:px-16 lg:px-24">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Explore StyleHub
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-700 hover:text-white"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="px-6 py-16 md:px-16 lg:px-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Handpicked for you
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            View All <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => setRefresh((value) => value + 1)}
              className="mt-5 rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center">
            <p className="text-gray-600">
              No featured products available yet.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Mark products as Featured in your admin dashboard.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-block rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white"
            >
              Explore All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* LATEST ARRIVALS */}
      <section className="bg-white px-6 py-16 md:px-16 lg:px-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Fresh arrivals
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Latest Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Shop All <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : !error && latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !error && (
            <p className="py-10 text-center text-gray-500">
              No products available yet.
            </p>
          )
        )}
      </section>

      {/* PROMOTIONAL SECTION */}
      <section className="bg-emerald-800 px-6 py-16 text-center text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
          StyleHub
        </p>

        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
          Find your next favourite look.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-emerald-100">
          Explore our latest collection and discover styles
          that match your personality.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-block rounded-full bg-white px-8 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          Explore Shop
        </Link>
      </section>
    </main>
  );
};

export default Home;
