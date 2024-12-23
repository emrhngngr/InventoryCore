import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Token'ı localStorage'da saklıyoruz
      localStorage.setItem("token", response.data.token);

      // Başarı mesajı göster
      Swal.fire({
        title: "Başarılı!",
        text: "Başarıyla giriş yaptınız.",
        icon: "success",
        confirmButtonText: "Tamam",
      });

      // Kullanıcıyı yönlendiriyoruz
      window.location.href = "/user/dashboard";
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Giriş sırasında bir hata oluştu.";

      // Hata mesajı göster
      Swal.fire({
        title: "Hata!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Giriş Yap
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
