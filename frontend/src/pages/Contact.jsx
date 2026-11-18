import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "../api/siteSettingsApi";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [settings, setSettings] = useState({
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Fetch contact information from MongoDB
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();

        if (data) {
          setSettings({
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        console.error("Failed to load contact information:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend contact form integration will be added separately.
    console.log("Contact form:", form);

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="bg-[#f8f5ef] px-6 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-bold uppercase tracking-widest text-emerald-700">
            Get in touch
          </p>

          <h1 className="mt-3 text-4xl font-bold">Contact Us</h1>

          <p className="mt-4 text-gray-600">
            Have a question about an order or product? Send us a message.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">

          {/* Dynamic Contact Information */}
          <div className="space-y-7">
            {settings.contactEmail && (
              <div className="flex gap-4">
                <Mail className="shrink-0 text-emerald-700" />

                <div>
                  <h3 className="font-bold">Email</h3>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-gray-600 hover:text-emerald-700"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}

            {settings.contactPhone && (
              <div className="flex gap-4">
                <Phone className="shrink-0 text-emerald-700" />

                <div>
                  <h3 className="font-bold">Phone</h3>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="text-gray-600 hover:text-emerald-700"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>
            )}

            {settings.address && (
              <div className="flex gap-4">
                <MapPin className="shrink-0 text-emerald-700" />

                <div>
                  <h3 className="font-bold">Location</h3>
                  <p className="text-gray-600">{settings.address}</p>
                </div>
              </div>
            )}

            {!settings.contactEmail &&
              !settings.contactPhone &&
              !settings.address && (
                <p className="text-sm text-gray-500">
                  Contact information is currently unavailable.
                </p>
              )}
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-7 shadow-sm"
          >
            {[
              ["name", "Your Name", "text"],
              ["email", "Email Address", "email"],
              ["subject", "Subject", "text"],
            ].map(([name, label, type]) => (
              <label key={name} className="mb-5 block">
                <span className="mb-2 block text-sm font-medium">
                  {label}
                </span>

                <input
                  type={type}
                  required
                  value={form[name]}
                  onChange={(e) =>
                    setForm({ ...form, [name]: e.target.value })
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Message
              </span>

              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-emerald-600"
              />
            </label>

            {submitted && (
              <p className="mt-4 text-sm text-emerald-700">
                Message submitted in the demo interface.
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;