import {useNavigate} from '@remix-run/react';
import sizeFinderIcon from '../assets/size.png';
import {useState, useRef, useEffect} from 'react';
import {SizeFinder} from './SizeFinder';

/**
 * Product options selector component
 * @param {{
 *   option: MappedProductOptions;
 *   productTitle: string;
 * }}
 */
export function ProductOptions({option, productTitle}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (option.optionValues.length === 1) return null;

  // Find selected size if this is the size option
  const selectedSize = option.name === 'Size' 
    ? option.optionValues.find(value => value.selected)?.name 
    : null;

  const isSize = option.name.toLowerCase() === 'size';
  const showDropdown = isSize && option.optionValues.length > 4;

  return (
    <div key={option.name} className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {option.name.toLowerCase() === 'color' ? (
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
              <span className="text-sm text-gray-600 leading-none ml-2">
                {option.optionValues.find(value => value.selected)?.name || ''}
              </span>
            </div>
          </div>
        ) : showDropdown ? (
          <div className="w-full sm:max-w-[300px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
                <span className="text-sm text-gray-600 leading-none">
                  {option.optionValues.find(value => value.selected)?.name || ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <img 
                  src={sizeFinderIcon} 
                  alt="Size Guide" 
                  className="w-4 h-4"
                />
                <button 
                  className="underline"
                  onClick={() => setIsSizeFinderOpen(true)}
                >
                  Size Finder
                </button>
              </div>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                  w-full h-[48px] px-4 
                  border-2 rounded-lg bg-white
                  text-base font-medium 
                  transition-all duration-200
                  focus:outline-none focus:border-black
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-between
                  ${selectedSize ? 'text-black border-gray-200' : 'text-gray-500 border-gray-200'}
                  ${isOpen ? 'border-black' : ''}
                `}
              >
                <span>{selectedSize || `Select ${option.name}`}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-lg shadow-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    {option.optionValues.map((opt) => (
                      <button
                        key={opt.handle}
                        className={`
                          w-full px-4 py-3 text-left text-base
                          transition-colors duration-200
                          flex items-center justify-between
                          ${opt.selected ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}
                          ${!opt.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${opt.selected ? 'text-black' : 'text-gray-700'}
                        `}
                        disabled={!opt.available}
                        onClick={() => {
                          if (opt.available) {
                            navigate(`?${opt.variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                            setIsOpen(false);
                          }
                        }}
                      >
                        <span>{opt.name}</span>
                        {opt.selected && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {!opt.available && (
                          <span className="text-sm text-gray-400 italic">Out of Stock</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
              {option.name === 'Size' && (
                <span className="text-sm text-gray-600 leading-none">
                  {option.optionValues.find(value => value.selected)?.name || ''}
                </span>
              )}
              {option.name.toLowerCase() === 'color' && (
                <span className="text-sm text-gray-600 leading-none ml-2">
                  {option.optionValues.find(value => value.selected)?.name || ''}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {option.name.toLowerCase() === 'color' ? (
          option.optionValues.map(({name, handle, selected, available, variantUriQuery}) => (
            <ColorSwatch
              key={handle}
              name={name}
              handle={handle}
              selected={selected}
              available={available}
              variantUriQuery={variantUriQuery}
            />
          ))
        ) : showDropdown ? (
          <></>
        ) : (
          option.optionValues.map(({name, handle, selected, available, variantUriQuery}) => (
            <SizeOption
              key={handle}
              name={name}
              handle={handle}
              selected={selected}
              available={available}
              variantUriQuery={variantUriQuery}
            />
          ))
        )}
      </div>
      <SizeFinder 
        isOpen={isSizeFinderOpen}
        onClose={() => setIsSizeFinderOpen(false)}
        productTitle={productTitle}
      />
    </div>
  );
}

/**
 * Color swatch component
 */
function ColorSwatch({name, handle, selected, available, variantUriQuery}) {
  const navigate = useNavigate();
  
  // Map color names to actual CSS color values
  const colorMap = {
    'black': '#000000',
    'beige': '#F5F5DC',
    'olive': '#808000',
    // Add more colors as needed
  };
  
  const colorValue = colorMap[name.toLowerCase()] || name.toLowerCase();
  
  return (
    <button
      key={handle}
      className={`
        w-8 h-8 rounded-full relative
        ${!available && 'opacity-50 cursor-not-allowed'}
        ring-1 ring-gray-300 ring-offset-1
        ${selected ? 'ring-2 ring-black ring-offset-2' : ''}
        transition-all duration-200
      `}
      style={{
        backgroundColor: colorValue,
        border: colorValue === '#FFFFFF' ? '1px solid #E5E5E5' : 'none'
      }}
      disabled={!available}
      onClick={() => {
        navigate(`?${variantUriQuery}`, {
          replace: true,
          preventScrollReset: true,
        });
      }}
      title={name}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg 
            className={`w-4 h-4 ${colorValue === '#000000' ? 'text-white' : 'text-black'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

/**
 * Size option component
 */
function SizeOption({name, handle, selected, available, variantUriQuery}) {
  const navigate = useNavigate();

  const baseClasses = "min-w-[65px] h-[48px] px-5 py-2 text-base font-medium rounded-lg transition-all duration-200";
  const selectedClasses = "!bg-gray-100 !text-black !border-2 !border-black hover:!bg-gray-50";
  const defaultClasses = "bg-white text-black border border-gray-200 hover:border-black hover:bg-gray-50";
  const unavailableClasses = "opacity-40 cursor-not-allowed bg-gray-50 border border-gray-200 relative overflow-hidden";
  const availableClasses = "hover:shadow-sm active:scale-[0.98]";

  const buttonClasses = [
    baseClasses,
    selected ? selectedClasses : defaultClasses,
    available ? availableClasses : unavailableClasses
  ].join(' ');

  return (
    <button
      key={handle}
      className={buttonClasses}
      style={{
        ...(selected && {
          borderWidth: '2px',
          borderColor: '#000000',
          borderStyle: 'solid'
        })
      }}
      disabled={!available}
      onClick={() => {
        navigate(`?${variantUriQuery}`, {
          replace: true,
          preventScrollReset: true,
        });
      }}
    >
      {!available && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-gray-300 absolute transform rotate-45"></div>
        </div>
      )}
      <span className={!available ? 'opacity-40' : ''}>
        {name}
      </span>
    </button>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
