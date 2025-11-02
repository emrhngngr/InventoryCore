import React, { useState } from 'react';

const TruncatedDescription = ({ text, maxLength = 100 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const truncatedText = text.slice(0, maxLength) + '...';

  return (
    <>
      <span 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:text-blue-600"
      >
        {truncatedText}
        <span className="ml-1 text-blue-500 text-sm">(more...)</span>
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-xl p-6 m-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Detailed Description</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4 text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {text}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TruncatedDescription;