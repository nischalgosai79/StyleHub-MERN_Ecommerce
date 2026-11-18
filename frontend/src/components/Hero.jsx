import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteSettings } from "../api/siteSettingsApi";

const defaultHero = {
  image:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800",
  subtitle: "New season collection 2026",
  title: "Define Your Own Style.",
  description:
    "Discover timeless fashion, modern essentials and everyday outfits designed to make you stand out.",
  buttonText: "SHOP COLLECTION",
  buttonLink: "/shop",
};

const Hero = () => {
  const [settings, setSettings] = useState({});
  const [imageError, setImageError] = useState(false);

  // Fetch homepage settings from MongoDB
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();

        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to load hero settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Reset image error when admin changes the hero image
  useEffect(() => {
    setImageError(false);
  }, [settings.heroImage]);

  // Map MongoDB field names to the Hero component
  const hero = {
    ...defaultHero,
    title: settings.heroTitle || defaultHero.title,
    description: settings.heroDescription || defaultHero.description,
    image: settings.heroImage || defaultHero.image,
  };

  const imageSrc = imageError ? defaultHero.image : hero.image;

  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[620px]">
      {/* Background image */}
      <img
        src={imageSrc}
        alt="StyleHub fashion collection"
        onError={() => setImageError(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-20 text-white sm:px-10 lg:px-16">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[4px] sm:text-sm">
          {hero.subtitle}
        </p>

        <h1 className="max-w-2xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          {hero.title}
        </h1>

        <p className="mt-6 max-w-md text-sm leading-7 text-gray-200 sm:text-base">
          {hero.description}
        </p>

        <Link
          to={hero.buttonLink}
          className="mt-9 inline-block bg-white px-9 py-4 text-sm font-bold text-black transition hover:bg-black hover:text-white"
        >
          {hero.buttonText}
        </Link>
      </div>
    </section>
  );
};

export default Hero;