import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f8f5ef] px-6 text-center">
      <h1 className="text-7xl font-black text-emerald-700">404</h1>

      <h2 className="mt-4 text-2xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-3 text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-full bg-emerald-700 px-7 py-3 font-semibold text-white"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;