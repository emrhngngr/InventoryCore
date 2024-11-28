import React from 'react';

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-between";

  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
