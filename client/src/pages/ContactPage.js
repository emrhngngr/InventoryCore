import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import Svg from "../assets/svg/undraw_emails_085h.svg";
import Navbar from "../components/navbar";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      details: ["+90 (555) 123 45 67", "+90 (555) 123 45 67"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["support@support.com", "support@support.com"],
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adres",
      details: ["Erenler Mahallesi", "Afyonkarahisar, Türkiye"],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Çalışma Saatleri",
      details: ["Pazartesi - Cuma: 09:00 - 18:00", "Cumartesi: 09:00 - 13:00"],
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        backgroundColor="white"
        hoverBackgroundColor="gray-50"
        hoverTextColor="#313131"
        textColor="#313131"
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sorularınız için bize ulaşın. Ekibimiz size yardımcı olmaktan
            mutluluk duyacaktır.
          </p>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="flex justify-center items-center">
          <img
            src={Svg}
            alt="Dashboard Illustration"
            className="w-full max-w-sm lg:max-w-md object-contain"
          />
        </div>

        {/* Contact Info Grid */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;