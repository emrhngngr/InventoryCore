import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle,
  Settings,
  Star,
  Users,
} from "lucide-react";
import React from "react";
import Navbar from "../components/MainPage/Navbar";

import { useNavigate } from "react-router-dom";
import Svg from "../assets/svg/undraw_dashboard_p93p.svg";
import Footer from "../components/MainPage/Footer";
import PersonImage from '../assets/images/Person.png'

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

  const people = [
    {
      name: "Ahmet Yılmaz",
      position: "IT Müdürü",
      company: "Tech Solutions",
      image: PersonImage,
      content:
        "InventoryCore sayesinde envanter yönetimimiz çok daha verimli hale geldi. Özellikle ISO 27001 uyumluluğu bizim için büyük bir artı.",
      rating: 5,
    },
    {
      name: "Ayşe Kaya",
      position: "Operasyon Direktörü",
      company: "Mega Holding",
      image: PersonImage,
      content:
        "Kullanıcı dostu arayüzü ve detaylı raporlama özellikleri ile tam aradığımız çözüm. Ekip verimliliğimiz gözle görülür şekilde arttı.",
      rating: 5,
    },
    {
      name: "Mehmet Demir",
      position: "Sistem Yöneticisi",
      company: "Global Lojistik",
      image: PersonImage,
      content:
        "7/24 destek ve sürekli güncellenen özellikleri ile kendini sürekli geliştiren bir platform. Kesinlikle tavsiye ediyorum.",
      rating: 5,
    },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar
        backgroundColor="transparent"
        hoverBackgroundColor="white"
        hoverTextColor="#313131"
        textColor="black"
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between pt-20 pb-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex flex-col justify-center mt-32 mb-8 lg:mb-0"
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Envanter Yönetiminde
              <br />
              <span className="text-blue-600">Yeni Nesil</span> Çözüm
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-gray-600">
              <b>ISO 27001</b> destekli envanter yönetim sistemi ile
              işletmenizin verimliliğini artırın. Modern, güvenli ve kullanıcı
              dostu arayüz.
            </p>
            <div className="space-x-4 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contact")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                İletişime Geçin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/services")}
                className="border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                Daha Fazlası <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right content - SVG */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <img
              src={Svg}
              alt="Dashboard Illustration"
              className="w-full max-w-lg xl:max-w-xl"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Neden InventoryCore?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modern işletmelerin ihtiyaçlarına özel geliştirilmiş kapsamlı
            çözümler sunuyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Öne Çıkan Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İşletmenizin ihtiyaç duyduğu tüm özellikler tek bir platformda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "ISO 27001 Uyumluluğu",
                description:
                  "Uluslararası güvenlik standartlarına uygun altyapı ve süreç yönetimi",
                features: [
                  "Güvenlik politikaları yönetimi",
                  "Risk değerlendirme araçları",
                  "Denetim takibi",
                  "Uyumluluk raporlaması",
                ],
              },
              {
                title: "Gelişmiş Raporlama",
                description:
                  "Kapsamlı analiz ve raporlama araçları ile verilerinizi anlamlandırın",
                features: [
                  "Özelleştirilebilir dashboardlar",
                  "Gerçek zamanlı metrikler",
                  "Excel çıktısı",
                  "Otomatik raporlama",
                ],
              },
              {
                title: "Gelişmiş Görev Yönetimi",
                description:
                  "İş süreçlerinizi kolaylaştırmak için görev yönetimi araçları.",
                features: [
                  "Kapsamlı görev atama seçenekleri",
                  "Haftalık görev takibi seçimleri",
                  "Gerçek zamanlı durum güncellemeleri",
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <ul className="space-y-3">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Başarı hikayelerimizi ve müşteri deneyimlerimizi keşfedin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {people.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600">{testimonial.position}</p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default HomePage;
