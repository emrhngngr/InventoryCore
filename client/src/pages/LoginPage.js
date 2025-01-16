import axios from "axios";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { IoCloud } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Svg from "../assets/svg/12643932_5031661.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

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
    <div className="flex justify-between min-h-screen h-full w-full gap-x-12">
      <div className="flex flex-col justify-between w-full px-4 py-12 md:pl-12 lg:pl-24 xl:pl-32">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-x-2" to="/">
            <IoCloud className="size-20 text-blue-600" />
          </Link>

          <Link
            to="/"
            className="flex items-center gap-x-2 text-black dark:text-white hover:underline"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>

        <div className="flex flex-col gap-y-4 max-w-sm w-full mx-auto lg:mx-0">
          <h1 className="text-4xl font-bold">Giriş Yap</h1>

          <form
            className="flex flex-col gap-y-4 mt-4 w-full text-gray-500 dark:text-gray-400"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-y-1">
              <span className="text-xl">Email</span>
              <div className="group flex items-center gap-x-2 border border-black/35 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:text-blue-600">
                <label htmlFor="email">
                  <Mail className="size-4" />
                </label>

                <input
                  type="email"
                  className="w-full bg-transparent text-black font-normal placeholder:font-light group-focus-within:text-blue-600"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-xl">Şifre</span>
              <div className="group flex items-center gap-x-2 border border-black/35 rounded-lg px-4 py-2 focus-within:border-blue-600 focus-within:text-blue-600">
                <label htmlFor="password">
                  <Lock className="size-4" />
                </label>

                <input
                  type="password"
                  className="w-full bg-transparent text-black font-normal placeholder:font-light border border-transparent"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="submit"
                  className="text-sm"
                  tabIndex={-1}
                ></button>
              </div>
            </div>

            <button
              type="submit"
              className="relative flex items-center justify-center text-lg font-medium px-4 py-2 rounded-lg mt-4 text-white bg-blue-600 hover:bg-blue-700"
            >
              <span>Giriş Yap</span>
              <ArrowRight className="absolute right-4 size-5" />
            </button>
          </form>
        </div>
        <div></div>
      </div>
      <div className="relative hidden lg:flex flex-col justify-end max-w-screen-lg w-full">
        <img
          src={Svg}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-black/90"></div>

        <div className="flex flex-col m-8 p-4 max-w-lg text-center mx-auto text-white backdrop-blur rounded-lg z-10 gap-y-4">
          <p className="text-xl opacity-70">
            InventorCore, varlıklarınızı yönetmek için harika bir platformdur.
            Kullanıcı dostu arayüzü ve güçlü özellikleri ile varlıklarınızı
            kolayca yönetebilirsiniz.
          </p>

          <p>Emirhan Güngör, CEO InventoryCore</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
