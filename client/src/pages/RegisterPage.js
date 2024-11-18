import axios from "axios";
import React, { useState } from "react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name,
          email,
          password,
          isAdmin,
        }
      );
      setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
      console.log("Register Success:", response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Kayıt sırasında bir hata oluştu."
      );
      console.error("Register Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Kayıt Ol
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              İsim
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="İsim"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="block w-full px-4 py-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Zaten bir hesabınız var mı?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
