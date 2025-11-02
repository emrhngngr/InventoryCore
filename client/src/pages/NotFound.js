import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl mt-4">Oops! Seems like you're lost. 🌌</p>
      <p className="text-gray-600 mt-2 text-center">
        We couldn't find the page you're looking for — no worries, we'll take you back!
      </p>
      <Link
        to="/"
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
