import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data.stats || data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load dashboard."
        );
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    ["Total Products", stats?.totalProducts ?? 0],
    ["Total Orders", stats?.totalOrders ?? 0],
    ["Customers", stats?.totalCustomers ?? 0],
    ["Pending Orders", stats?.pendingOrders ?? 0],
    ["Delivered Orders", stats?.deliveredOrders ?? 0],
    ["Revenue", `Rs. ${Number(stats?.revenue ?? 0).toLocaleString()}`],
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Overview of your StyleHub store.
      </p>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!stats ? (
        <p className="mt-8">Loading dashboard...</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">{label}</p>
              <h2 className="mt-3 text-3xl font-bold text-emerald-800">
                {value}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;