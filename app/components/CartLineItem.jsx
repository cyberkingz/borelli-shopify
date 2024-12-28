import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="flex items-center gap-4 py-4 px-4">
      <div className="flex-shrink-0 aspect-square w-24 h-24 border border-gray-200 rounded-sm overflow-hidden">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={96}
            loading="lazy"
            width={96}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="block hover:text-gray-500 transition-colors"
        >
          <h3 className="text-lg font-medium truncate">{product.title}</h3>
        </Link>
        
        <div className="mt-1 text-sm text-gray-500">
          {selectedOptions.map((option) => (
            <div key={option.name}>
              {option.name}: {option.value}
            </div>
          ))}
        </div>
        
        <div className="mt-2 flex items-center gap-4">
          <CartLineQuantityAdjust line={line} />
          <div className="ml-auto font-medium">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <CartLineRemoveButton lineIds={[id]} />
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center border border-gray-200 rounded-sm">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          &#8722;
        </button>
      </CartLineUpdateButton>

      <div className="px-2 text-center min-w-[40px]">
        {quantity}
      </div>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          &#43;
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-500"
        disabled={disabled}
        type="submit"
      >
        <span className="sr-only">Remove</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine<CartApiQueryFragment>} OptimisticCartLine */
