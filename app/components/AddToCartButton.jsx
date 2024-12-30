import {CartForm} from '@shopify/hydrogen';
import {useFacebookPixel} from '~/hooks/useFacebookPixel';

/**
 * @typedef {Object} Analytics
 * @property {Array<{
 *   name: string;
 *   variant?: string;
 *   price?: string;
 *   currency?: string;
 *   sku?: string;
 *   vendor?: string;
 * }>} products
 * @property {string} [currency]
 */

/**
 * @param {{
 *   analytics?: Analytics;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   className?: string;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className = '',
}) {
  const {trackAddToCart} = useFacebookPixel();
  
  const handleClick = () => {
    // Track the add to cart event
    if (lines?.[0] && analytics?.products?.[0]) {
      const line = lines[0];
      const product = analytics.products[0];
      
      const productData = {
        id: line.merchandiseId,
        title: product.name,
        variant: product.variant,
        price: {
          amount: product.price || line.attributes?.find(attr => attr.key === 'price')?.value || '0',
          currencyCode: product.currency || line.attributes?.find(attr => attr.key === 'currency')?.value || 'EUR'
        },
        sku: product.sku,
        vendor: product.vendor
      };

      trackAddToCart(productData);
    }
    
    // Call the original onClick if provided
    if (onClick) onClick();
  };

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isAdding = fetcher.state !== 'idle';
        
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={handleClick}
              disabled={disabled ?? isAdding}
              className={`
                reset
                w-full min-w-full h-[60px] py-4 text-[16px] font-medium
                flex items-center justify-center gap-2
                transition-all duration-200 ease-out
                shadow-[0_4px_10px_rgba(0,0,0,0.15)]
                hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                ${disabled 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                  : isAdding
                  ? 'bg-gray-800 text-white'
                  : 'bg-black text-white hover:opacity-90 active:scale-[0.99] active:shadow-[0_2px_5px_rgba(0,0,0,0.1)]'
                }
                ${className}
              `.trim()}
              style={{
                backgroundColor: disabled ? undefined : '#000000',
              }}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <span className="tracking-wide uppercase">{children}</span>
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}

/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
