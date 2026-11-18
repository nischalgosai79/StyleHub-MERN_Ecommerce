import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminSettings from "./admin/AdminSettings";

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Customer website */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/shop"
          element={
            <Layout>
              <Shop />
            </Layout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Layout>
                <Wishlist />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Layout>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <Layout>
                <MyOrders />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        {/* Admin panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
};

export default App;