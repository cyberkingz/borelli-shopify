import {useState} from 'react';

export function Accordion({title, children, defaultOpen = false}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200 last:border-b py-4">
      <button
        className="w-full py-6 flex justify-between items-center text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[16px] uppercase font-medium tracking-wide">{title}</span>
        <div className={`
          w-7 h-7 rounded-full border border-gray-400
          flex items-center justify-center
          transition-all duration-300 ease-out
          group-hover:border-black
          ${isOpen ? 'bg-black border-black' : ''}
        `}>
          <svg 
            width="11" 
            height="7" 
            viewBox="0 0 10 6" 
            fill="none" 
            className={`
              transform transition-transform duration-300
              ${isOpen ? 'rotate-180' : ''}
            `}
          >
            <path 
              d="M1 1L5 5L9 1" 
              stroke={isOpen ? "white" : "black"} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="text-[15px] leading-relaxed text-gray-600 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}
