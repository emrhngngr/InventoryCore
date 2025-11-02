import {
  BarChart3,
  Box,
  Clock,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import Svg from "../assets/svg/undraw_growth-chart_h2w8.svg";
import Navbar from "../components/MainPage/Navbar";
import { motion } from 'framer-motion';
import Footer from "../components/MainPage/Footer";

const ServicePage = () => {
  const features = [
    {
      icon: <Box className="w-8 h-8" />,
      title: "Inventory Management",
      description: "Track and manage inventory in detail",
      details: [
        "Asset custom categorization",
        "ISO 27001 compliant security",
        "Detailed asset operations",
        "Customizable category management",
      ],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Task Management",
      description: "Task management tools to streamline your workflows.",
      details: [
        "Comprehensive task assignment options",
        "Weekly task tracking options",
        "Real-time status updates",
        "Task-based performance reporting",
      ],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Management",
      description: "Role-based access for your team members",
      details: [
        "Role and permission management",
        "User activity logs",
        "Group-based organization",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar backgroundColor="transparent" hoverBackgroundColor="white" hoverTextColor="#313131" textColor="#313131" />
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center"
          >
            <img
              src={Svg}
              alt="Dashboard Illustration"
              className="w-full max-w-sm lg:max-w-md object-contain hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Modernize your inventory management and boost efficiency with
              InventoryCore.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  {React.cloneElement(feature.icon, {
                    className: "w-8 h-8 text-blue-600",
                  })}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why InventoryCore?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Zap />, title: "Fast & Reliable" },
              { icon: <ShieldCheck />, title: "Secure Infrastructure" },
              { icon: <Smartphone />, title: "Mobile Friendly" },
              { icon: <Clock />, title: "24/7 Support" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {React.cloneElement(item.icon, {
                    className: "w-6 h-6 text-blue-600",
                  })}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ServicePage;
