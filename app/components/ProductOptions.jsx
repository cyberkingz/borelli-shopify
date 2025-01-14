import {useNavigate, useSearchParams} from '@remix-run/react';
import sizeFinderIcon from '../assets/size.png';
import {useState, useRef, useEffect} from 'react';
import {SizeFinder} from './SizeFinder';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * Product options selector component
 * @param {{
 *   option: MappedProductOptions;
 *   productTitle: string;
 *   product: any;
 * }}
 */
export function ProductOptions({
  option, 
  productTitle, 
  product,
  singleSelectedVariant,
  setSingleSelectedVariant,
  singleSelectedOptions,
  setSingleSelectedOptions
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {t} = useTranslation();

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

  if (!option || !option.optionValues || option.optionValues.length === 1) return null;

  // Normalize option names to handle both English and translated versions
  const normalizedOptionName = option.name.toLowerCase();
  const isColor = normalizedOptionName === 'color' || normalizedOptionName === 'farbe';
  const isSize = normalizedOptionName === 'size' || normalizedOptionName === 'größe' || normalizedOptionName === 'shoe size' || normalizedOptionName === 'schuhgröße';
  const showDropdown = isSize && option.optionValues.length > 4;

  const handleOptionChange = (optionName, optionValue) => {
    const NewValues = singleSelectedOptions.map(item => {
      if (item.name === optionName) {
        return { ...item, value: optionValue };
      }
      return item;
    });      
   
    setSingleSelectedOptions(NewValues);

    const normalizedNewValues = JSON.stringify(NewValues).replace(/\s+/g, '').toLowerCase();
    product.variants.nodes.forEach(node => {
      const normalizedSelectedOptions = JSON.stringify(node?.selectedOptions).replace(/\s+/g, '').toLowerCase();
      if(normalizedSelectedOptions === normalizedNewValues) {
        setSingleSelectedVariant(node);
      }
    });   
   
    const newSearchParams = new URLSearchParams(searchParams);
    
    // If it's a color option, we want to update it regardless of size
    if (isColor) {
      newSearchParams.set(optionName, optionValue);
    } else {
      // For non-color options (like size), ensure we have a color selected
      const currentColor = searchParams.get('Color') || searchParams.get('Farbe');
      if (currentColor) {
        newSearchParams.set(isColor ? 'Color' : 'Farbe', currentColor);
      }
      newSearchParams.set(optionName, optionValue);
    }
  };

  return (
    <div className="grid gap-0">
      <div className="flex flex-col gap-2">
        {isColor ? (
          <div className="flex items-center">
            <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
            <span className="text-sm text-gray-600 leading-none ml-2">
              {singleSelectedVariant?.selectedOptions.find(opt => 
                opt.name.toLowerCase() === normalizedOptionName
              )?.value}
            </span>
          </div>
        ) : showDropdown ? (
          <div className="flex items-center justify-between w-full sm:max-w-[300px]">
            <div className="flex items-center">
              <span className="font-semibold uppercase min-w-[60px]">{option.name}:</span>
              <span className="text-sm text-gray-600 leading-none">
                {singleSelectedVariant?.selectedOptions.find(opt => 
                  opt.name.toLowerCase() === normalizedOptionName
                )?.value}
              </span>
            </div>
            {isSize && (
              <button
                onClick={() => setIsSizeFinderOpen(true)}
                className="text-sm text-gray-500 flex items-center"
              >
                <img src={sizeFinderIcon} alt={t('product.size.guide')} className="w-4 h-4 mr-1" />
                {t('product.size.guide')}
              </button>
            )}
          </div>
        ) : null}

        {/* Color swatches */}
        {isColor && (
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((opt) => (
              <ColorSwatch
                key={option.name + opt.name}
                name={option.name}
                handle={opt.name}
                selected={singleSelectedVariant?.selectedOptions.find(so => 
                  so.name.toLowerCase() === normalizedOptionName
                )?.value === opt.name}
                available={!!opt.firstSelectableVariant}
                onClick={() => handleOptionChange(option.name, opt.name)}
                customColor={opt.swatch?.color || opt.name}
                singleSelectedVariant={singleSelectedVariant}
              />
            ))}
          </div>
        )}

        {/* Size options */}
        {isSize && (
          <>
            {showDropdown ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full sm:max-w-[300px] px-4 py-2 text-left border rounded-lg focus:outline-none"
                >
                  {singleSelectedVariant?.selectedOptions.find(opt => 
                    opt.name.toLowerCase() === normalizedOptionName
                  )?.value || t('product.size.select')}
                </button>
                {isOpen && (
                  <div className="absolute z-10 w-full sm:max-w-[300px] mt-1 bg-white border rounded-lg shadow-lg">
                    {option.optionValues.map((opt) => (
                      <button
                        key={option.name + opt.name}
                        onClick={() => {
                          handleOptionChange(option.name, opt.name);
                          setIsOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                          !opt.firstSelectableVariant ? 'text-gray-400 cursor-not-allowed' : ''
                        } ${singleSelectedVariant?.selectedOptions.find(so => 
                          so.name.toLowerCase() === normalizedOptionName
                        )?.value === opt.name ? 'bg-gray-100' : ''}`}
                        disabled={!opt.firstSelectableVariant}
                      >
                        {opt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map((opt) => (
                  <SizeOption
                    key={option.name + opt.name}
                    name={option.name}
                    handle={opt.name}
                    selected={singleSelectedVariant?.selectedOptions.find(so => 
                      so.name.toLowerCase() === normalizedOptionName
                    )?.value === opt.name}
                    available={!!opt.firstSelectableVariant}
                    onClick={() => handleOptionChange(option.name, opt.name)}
                    singleSelectedVariant={singleSelectedVariant}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isSizeFinderOpen && (
        <SizeFinder
          isOpen={isSizeFinderOpen}
          onClose={() => setIsSizeFinderOpen(false)}
          productTitle={productTitle}
        />
      )}
    </div>
  );
}

// Color swatch component
function ColorSwatch({name, handle, selected, available, onClick, customColor, singleSelectedVariant}) {
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'schwarz': '#000000',
    'weiß': '#FFFFFF',
    'rot': '#FF0000',
    'blau': '#0000FF',
    // Add more color mappings as needed
  };

  const backgroundColor = colorMap[handle.toLowerCase()] || customColor;

  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`w-8 h-8 rounded-full border-2 ${
        selected ? 'border-black' : 'border-gray-200'
      } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        backgroundColor,
        boxShadow: selected ? '0 0 0 2px white, 0 0 0 4px black' : 'none',
      }}
      title={handle}
    />
  );
}

// Size option component
function SizeOption({name, handle, selected, available, onClick, singleSelectedVariant}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`min-w-[48px] h-12 px-3 text-sm border rounded-lg ${
        selected
          ? 'border-black bg-black text-white'
          : 'border-gray-200 hover:border-gray-400'
      } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {handle}
    </button>
  );
}
