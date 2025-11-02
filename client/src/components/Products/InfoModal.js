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
              <span className="line-clamp-1">What are Privacy and Criticality Levels?</span>
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
          {/* Privacy Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Privacy Level
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-4">
              <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-red-700">Top Secret (Score: 5)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">If access information for the asset is exposed, unauthorized parties may gain access to the system. The system and information are fully at risk.</p>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-700">Confidential (Score: 3)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">If access information for the asset is exposed, system security is not jeopardized but unauthorized access to this hardware may be possible.</p>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-green-700">Low Sensitivity (Score: 1)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">Exposure of access information does not affect system security and business continuity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kritiklik Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Criticality (Availability + Integrity)
            </h3>
            <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-4">
              <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-red-700">High (Score: 5)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">If the asset goes offline it may disable the entire system. Up to 1 hour of downtime may be acceptable. Ensuring system integrity is crucial.</p>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-yellow-700">Medium (Score: 3)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">If the asset goes offline the system continues to operate. Up to 24 hours of downtime may be acceptable.</p>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-green-700">Low (Score: 1)</div>
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">If the asset goes offline it does not affect system security. Up to 2 days of downtime may be acceptable.</p>
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