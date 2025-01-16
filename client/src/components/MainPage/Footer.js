import React from "react";

const Footer = () => {
  return (
    <div>
      {/* Footer Section */}
      <div className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Hakkımızda
              </h3>
              <p className="text-gray-400">
                InventoryCore, modern işletmelerin envanter yönetimi
                ihtiyaçlarını karşılamak için geliştirilmiş yenilikçi bir
                platformdur.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Hızlı Erişim
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ana Sayfa
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white transition-colors">
                    Servisler
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    İletişim
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                İletişim
              </h3>
              <ul className="space-y-2">
                <li>Email: info@inventorycore.com</li>
                <li>Tel: +90 (555) 123 45 67</li>
                <li>Adres: Merkez Mah. Teknoloji Cad.</li>
                <li>No: 1 Afyonkarahisar</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Bizi Takip Edin
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} InventoryCore. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
