import {useNavigate, useSearchParams} from '@remix-run/react';
import sizeFinderIcon from '../assets/size.png';
import {useState, useRef, useEffect} from 'react';
import {SizeFinder} from './SizeFinder';

/**
 * Product options selector component
 * @param {{
 *   option: MappedProductOptions;
 *   productTitle: string;
 *   product: any;
 * }}
 */
export function ProductOptions({option, productTitle, product}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    if (!currentParams.has('variant')) {
      navigate('?', { replace: true });
    }
  }, []);

  if (option.optionValues.length === 1) return null;

  const isSize = option.name.toLowerCase() === 'size';
  const showDropdown = isSize && option.optionValues.length > 4;

  const handleOptionChange = (optionName, optionValue) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(optionName, optionValue);
    navigate(`?${newSearchParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  return (
    <div className="grid gap-0">
      <div className="flex flex-col gap-2">
        {option.name.toLowerCase() === 'color' ? (
          <div className="flex items-center">
            <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
            <span className="text-sm text-gray-600 leading-none ml-2">
              {searchParams.get(option.name) || ''}
            </span>
          </div>
        ) : showDropdown ? (
          <div className="flex items-center justify-between w-full sm:max-w-[300px]">
            <div className="flex items-center">
              <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
              <span className="text-sm text-gray-600 leading-none">
                {searchParams.get(option.name) || ''}
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
        ) : (
          <div className="flex items-center">
            <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
            <span className="text-sm text-gray-600 leading-none">
              {searchParams.get(option.name) || ''}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {option.optionValues.map((opt, index) => {
            const isSelected = searchParams.get(option.name) === opt.name;
            const isColor = option.name.toLowerCase() === 'color';

            if (isColor) {
              const colorMetafield = product?.metafields?.find(
                metafield => metafield?.key === opt.name.toLowerCase().replace(/\s+/g, '-')
              );
              
              return (
                <ColorSwatch
                  key={index}
                  name={opt.name}
                  handle={opt.handle}
                  selected={isSelected}
                  available={opt.available}
                  onClick={() => handleOptionChange(option.name, opt.name)}
                  customColor={colorMetafield?.value}
                />
              );
            }

            if (showDropdown) return null;

            return (
              <SizeOption
                key={index}
                name={opt.name}
                handle={opt.handle}
                selected={isSelected}
                available={opt.available}
                onClick={() => handleOptionChange(option.name, opt.name)}
              />
            );
          })}
        </div>
      </div>
      {showDropdown && (
        <div className="w-full sm:max-w-[300px]">
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
                ${searchParams.get(option.name) ? 'text-black border-gray-200' : 'text-gray-500 border-gray-200'}
                ${isOpen ? 'border-black' : ''}
              `}
            >
              <span>{searchParams.get(option.name) || `Select ${option.name}`}</span>
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
                  {option.optionValues.map((opt, index) => (
                    <button
                      key={index}
                      className={`
                        w-full px-4 py-3 text-left text-base
                        transition-colors duration-200
                        flex items-center justify-between
                        ${searchParams.get(option.name) === opt.name ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}
                        ${!opt.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${searchParams.get(option.name) === opt.name ? 'text-black' : 'text-gray-700'}
                      `}
                      disabled={!opt.available}
                      onClick={() => {
                        if (opt.available) {
                          handleOptionChange(option.name, opt.name);
                          setIsOpen(false);
                        }
                      }}
                    >
                      <span>{opt.name}</span>
                      {searchParams.get(option.name) === opt.name && (
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
      )}
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
function ColorSwatch({name, handle, selected, available, onClick, customColor}) {
  // Map color names to actual CSS color values
  const colorMap = {
    'white': '#FFFFFF',
    'brown': '#8B4513',
    'fog blue': '#CDE3F7',
    'marine blue': '#003366',
    // Add more colors as needed
  };
  
  const colorValue = customColor || colorMap[name.toLowerCase()] || name.toLowerCase();
  
  return (
    <button
      title={name}
      onClick={onClick}
      className={`
        relative w-8 h-8 rounded-full overflow-hidden
        transition-all duration-200
        ${selected ? 'ring-2 ring-offset-2 ring-black' : ''}
        ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
      `}
      style={{
        backgroundColor: colorValue,
        border: '1px solid #e5e7eb'
      }}
      disabled={!available}
    >
      <span className="sr-only">{name}</span>
    </button>
  );
}

/**
 * Size option component
 */
function SizeOption({name, handle, selected, available, onClick}) {
  
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium
        border rounded-lg
        transition-all duration-200
        ${selected ? 'bg-black text-white border-black' : 'border-gray-300'}
        ${!available ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
      `}
      disabled={!available}
    >
      {name}
      {!available && (
        <span className="text-sm text-gray-400 italic ml-1">(Out of Stock)</span>
      )}
    </button>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
