import React from "react";
import { X, Shield, Clock, AlertTriangle } from "lucide-react";

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start sm:items-center z-50 p-2 sm:p-4 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div className="bg-white w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl my-2 sm:my-8 rounded-lg overflow-hidden shadow-xl relative">
        {/* Header */}
        <div className="border-b bg-gray-50/80 p-3 sm:p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 pr-8">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <span className="line-clamp-1">Gizlilik ve Kritiklik Derecesi Nedir?</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors absolute right-2 top-2.5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Gizlilik Derecesi Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Gizlilik Derecesi
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-4">
              <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-red-700">Çok Gizli (Puan: 5)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığa ait erişim bilgilerinin ortaya çıkması durumunda, sisteme yetkisiz kişilerin erişmesi mümkün hale gelir. Sistem ve bilgiler tamamen tehlikeye girer.</p>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-700">Gizli (Puan: 3)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığa ait erişim bilgilerinin ortaya çıkması durumunda, sistem güvenliği tehlikeye girmez ancak yalnızca bu donanıma yetkisiz kişilerin erişmesi mümkün hale gelir.</p>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-green-700">Önemsiz Gizlilik (Puan: 1)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığa ait erişim bilgilerinin ortaya çıkması, sistem güvenliği ve iş sürekliliğini etkilemez.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kritiklik Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Kritiklik (Erişilebilirlik + Bütünlük)
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-4">
              <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-red-700">Yüksek (Puan: 5)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığın devre dışı kalması tüm sistemi devre dışı bırakır. 1 saate kadar devre dışı kalması kabul edilebilir. Sistem bütünlüğünün sağlanması çok önemlidir.</p>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-700">Orta (Puan: 3)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığın devre dışı kalması durumunda sistem çalışmaya devam eder. 24 saate kadar devre dışı kalması kabul edilebilir.</p>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-green-700">Düşük (Puan: 1)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Varlığın devre dışı kalması sistem güvenliğini etkilemez. 2 güne kadar devre dışı kalması kabul edilebilir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;