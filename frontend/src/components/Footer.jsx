import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import { getSiteSettings } from "../api/siteSettingsApi";

const Footer = () => {
  const [settings, setSettings] = useState({
    storeName: "StyleHub",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();

        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert("Newsletter subscription will be connected to the backend later.");
  };

  return (
    <footer className="bg-[#17251f] px-6 py-14 text-white md:px-16 lg:px-24">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Store Information */}
        <div>
          <Link to="/" className="inline-flex items-center">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.storeName}
                className="max-h-12 max-w-[180px] object-contain"
              />
            ) : (
              <span className="text-2xl font-black">
                {settings.storeName || "StyleHub"}
              </span>
            )}
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-300">
            Discover your style with our collection of clothing,
            footwear and accessories.
          </p>

          <div className="mt-6 flex gap-3">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label={["Facebook", "Instagram", "Twitter"][index]}
                className="rounded-full bg-white/10 p-3 transition hover:bg-emerald-700"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-bold">Quick Links</h3>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <Link to="/" className="hover:text-emerald-400">Home</Link>
            <Link to="/shop" className="hover:text-emerald-400">Shop</Link>
            <Link to="/about" className="hover:text-emerald-400">About Us</Link>
            <Link to="/contact" className="hover:text-emerald-400">Contact</Link>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="mb-5 font-bold">Customer Service</h3>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <Link to="/my-orders" className="hover:text-emerald-400">
              My Orders
            </Link>
            <Link to="/wishlist" className="hover:text-emerald-400">
              Wishlist
            </Link>
            <Link to="/cart" className="hover:text-emerald-400">
              Shopping Cart
            </Link>
            <Link to="/contact" className="hover:text-emerald-400">
              Help & Support
            </Link>
          </div>
        </div>

        {/* Contact and Newsletter */}
        <div>
          <h3 className="mb-5 font-bold">Contact Information</h3>

          <div className="mb-6 flex flex-col gap-4 text-sm text-gray-300">
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-3 hover:text-emerald-400"
              >
                <Mail size={17} className="shrink-0" />
                <span>{settings.contactEmail}</span>
              </a>
            )}

            {settings.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-3 hover:text-emerald-400"
              >
                <Phone size={17} className="shrink-0" />
                <span>{settings.contactPhone}</span>
              </a>
            )}

            {settings.address && (
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0" />
                <span>{settings.address}</span>
              </div>
            )}
          </div>

          <h3 className="mb-3 font-bold">Stay Updated</h3>

          <p className="mb-4 text-sm leading-6 text-gray-300">
            Subscribe to hear about new collections and offers.
          </p>

          <form
            onSubmit={handleNewsletter}
            className="flex overflow-hidden rounded-full bg-white"
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
            />

            <button
              type="submit"
              className="bg-emerald-700 px-4 text-white hover:bg-emerald-600"
              aria-label="Subscribe"
            >
              <ArrowRight size={19} />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {settings.storeName || "StyleHub"}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;