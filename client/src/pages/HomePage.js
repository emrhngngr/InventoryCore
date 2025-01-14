import { BarChart3, Box, Settings, Users } from "lucide-react";
import React from "react";
import Svg from "../assets/svg/undraw_dashboard_p93p.svg";
import Navbar from "../components/MainPage/Navbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Box className="w-6 h-6" />,
      title: "Envanter Yönetimi",
      description: "Kolay ve etkili envanter takibi",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analitik",
      description: "Detaylı raporlar ve grafikler",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Çoklu Kullanıcı",
      description: "Ekip yönetimi ve yetkilendirme",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Özelleştirme",
      description: "İhtiyaçlarınıza göre ayarlamalar",
    },
  ];

  return (
    <div className="bg-white">
      {/* Navbar */}
      <Navbar
        backgroundColor="transparent"
        hoverBackgroundColor="white"
        hoverTextColor="#313131"
        textColor="black"
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between pt-20 pb-16">
          {/* Left content */}
          <div className="w-full lg:w-1/2 md:w-1/2 flex flex-col justify-center mb-8 lg:mb-0 lg:pt-32">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6">
              ISO 27001 ile özelleştirilmiş Envanter Sistemi
            </h1>
            <p className="text-lg lg:text-xl mb-8">
              ISO 27001 destekli envanter yönetim sistemi ile işletmenizin
              envanterini modernleştirin ve verimliliği artırın.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/contact")}
                className="bg-[#6c63ff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#8a84fc] transition-colors"
              >
                İletişime Geçin
              </button>
              <button
                onClick={() => navigate("/services")}
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Daha Fazlası
              </button>
            </div>
          </div>

          {/* Right content - SVG */}
          <div className="w-full md:w-2/3 lg:w-1/2 flex justify-center lg:justify-end">
            <img
              src={Svg}
              alt="Dashboard Illustration"
              className="w-4/5 h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          Servislerimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default HomePage;
