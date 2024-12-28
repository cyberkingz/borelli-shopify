import {useState} from 'react';

export function SizeFinder({isOpen, onClose, productTitle}) {
  const [unit, setUnit] = useState('CM');

  const measurements = {
    CM: {
      CHEST: [51, 53, 55, 57, 59],
      'SHOULDER TO SHOULDER': [45, 47, 49, 51, 53],
      'BACK LENGTH': [70, 72, 74, 76, 78],
      'SLEEVE LENGTH': [20, 21, 22, 23, 24],
      'BOTTOM WIDTH': [48, 50, 52, 54, 56]
    },
    INCHES: {
      CHEST: [20.1, 20.9, 21.7, 22.4, 23.2],
      'SHOULDER TO SHOULDER': [17.7, 18.5, 19.3, 20.1, 20.9],
      'BACK LENGTH': [27.6, 28.3, 29.1, 29.9, 30.7],
      'SLEEVE LENGTH': [7.9, 8.3, 8.7, 9.1, 9.4],
      'BOTTOM WIDTH': [18.9, 19.7, 20.5, 21.3, 22]
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold uppercase">{productTitle}</h2>
              <p className="text-gray-600">Size Chart</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-6 text-sm">
            <button 
              className={`px-2 py-1 ${unit === 'CM' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setUnit('CM')}
            >
              CM
            </button>
            <span className="text-gray-300">|</span>
            <button 
              className={`px-2 py-1 ${unit === 'INCHES' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setUnit('INCHES')}
            >
              INCHES
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b">
                  <th className="py-4 px-4 text-left font-semibold">SIZE</th>
                  <th className="py-4 px-4 text-center font-semibold">S</th>
                  <th className="py-4 px-4 text-center font-semibold">M</th>
                  <th className="py-4 px-4 text-center font-semibold">L</th>
                  <th className="py-4 px-4 text-center font-semibold">XL</th>
                  <th className="py-4 px-4 text-center font-semibold">XXL</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(measurements[unit]).map(([measurement, values]) => (
                  <tr key={measurement} className="border-b">
                    <td className="py-4 px-4 font-semibold">{measurement}</td>
                    {values.map((value, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
