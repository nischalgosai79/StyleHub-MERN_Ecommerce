import { useEffect, useState } from "react";
import { getWishlist } from "../api/wishlistApi";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlist();
        setProducts(data.wishlist || data.products || []);
      } catch (error) {
        console.error("Could not load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const normalizedProducts = products.map((product) => ({
    ...product,
    id: product._id || product.id,
  }));

  return (
    <section className="min-h-[60vh] bg-[#f8f5ef] px-6 py-16 md:px-16 lg:px-24">
      <h1 className="mb-10 text-3xl font-bold">My Wishlist</h1>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : normalizedProducts.length === 0 ? (
        <p className="text-gray-500">
          Your wishlist is empty. Add products you like from the shop.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {normalizedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;