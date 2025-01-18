import {Link} from '@remix-run/react';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useTranslation} from '~/hooks/useTranslation';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart}) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount = cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity > 0;
  const {t} = useTranslation();

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        {cartHasItems && (
          <h2 className="text-2xl font-bold mb-6 px-4">{t('cart.title')} ({cart.totalQuantity})</h2>
        )}
        <div aria-labelledby="cart-lines" className="divide-y divide-gray-200">
          <ul className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  const {t} = useTranslation();

  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <svg 
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">{t('cart.empty.title')}</h2>
        <p className="text-gray-500 mb-6">
          {t('cart.empty.description')}
        </p>
        <Link 
          to="/" 
          onClick={close} 
          prefetch="viewport"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-none bg-[#2B555A] text-white hover:opacity-90 transition-opacity"
        >
          {t('cart.empty.button')}
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
