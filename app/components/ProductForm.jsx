import {Link, useNavigate} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {Money} from '@shopify/hydrogen';
import {ProductOptions} from './ProductOptions';

// Import payment icons
import amexIcon from '../assets/payment-icons/amex.svg';
import applePayIcon from '../assets/payment-icons/apple-pay.svg';
import googlePayIcon from '../assets/payment-icons/google-pay.svg';
import mastercardIcon from '../assets/payment-icons/mastercard.svg';
import paypalIcon from '../assets/payment-icons/paypal.svg';
import visaIcon from '../assets/payment-icons/visa.svg';
import moneyBackIcon from '../assets/back_1.svg';
import shopifyPayIcon from '../assets/payment-icons/shopify-pay.svg';
import cardIcon from '../assets/payment-icons/credit-card.svg';
import {Accordion} from './Accordion';

const PAYMENT_METHODS = [
  { icon: visaIcon, name: 'Visa' },
  { icon: mastercardIcon, name: 'Mastercard' },
  { icon: amexIcon, name: 'American Express' },
  { icon: paypalIcon, name: 'PayPal' },
  { icon: applePayIcon, name: 'Apple Pay' },
  { icon: googlePayIcon, name: 'Google Pay' },
  { icon: shopifyPayIcon, name: 'Shopify Pay' },
  { icon: cardIcon, name: 'Credit Card' },
];

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   title: string;
 *   vendor: string;
 * }}
 */
export function ProductForm({productOptions, selectedVariant, title, vendor}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="flex flex-col gap-6">
      {/* Product Title */}
      <span className="text-3xl font-bold m-0 mt-0">{title}</span>

      {/* Price */}
      <div className="flex items-center">
        <Money 
          data={selectedVariant?.price}
          className="text-3xl font-semibold"
        />
        {selectedVariant?.compareAtPrice && (
          <Money
            data={selectedVariant.compareAtPrice}
            className="text-gray-500 line-through"
          />
        )}
      </div>

      {/* Product Options */}
      <div className="grid gap-6">
        {productOptions.map((option) => (
          <div key={option.name}>
            <ProductOptions 
              key={option.name} 
              option={option}
              productTitle={title}
            />
          </div>
        ))}
      </div>

      {/* Money Back Guarantee */}
      <div className="flex items-center gap-2 text-sm">
        <img 
          src={moneyBackIcon}
          alt="Money Back Guarantee" 
          className="w-5 h-5"
        />
        <span>Money Back Guarantee</span>
      </div>

      {/* Stock Status */}
      {selectedVariant?.availableForSale ? (
        <div className="flex items-center gap-2 mt-2">
          <div className="relative">
            <div className="w-2 h-2 bg-orange-500 rounded-full pulse-dot"></div>
            <div className="absolute -inset-1 bg-orange-500/30 rounded-full animate-ping"></div>
          </div>
          <p className="text-orange-500 text-sm font-medium">
            Only a few items left
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-sm font-medium mt-2">Out of stock</p>
      )}

      {/* Add to Cart Button */}
      <div className="w-full">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]
              : []
          }
          className="!bg-black hover:!bg-gray-900 !w-full"
        >
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap gap-2 justify-start max-[639px]:justify-center items-center">
          {PAYMENT_METHODS.map((method) => (
            <img
              key={method.name}
              src={method.icon}
              alt={method.name}
              className="w-8 h-5 sm:w-10 sm:h-6"
            />
          ))}
        </div>
      </div>

      {/* Product Details Accordions */}
      <div className="w-full mt-10">
        <Accordion title="DESCRIPTION" defaultOpen={true}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-medium text-black text-[16px]">Find a Time to Shine.</h3>
              <p className="text-gray-600 leading-relaxed">
                Step up and step out. The Luxe Polo has a 100% double folded Supima cotton that has a 
                voluminous feel and a bit of a shine to it. With a clean, 3 button placard, inset sleeve, and slim 
                fit, finding the right occasion or person to shine for shouldn't be hard.
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">100% Double Folded Supima Cotton</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">Voluminous Feel with Subtle Shine</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">Slim Fit with Clean 3-Button Design</span>
              </li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="SHIPPING INFO">
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="font-medium">UPDATE:</p>
              <p className="leading-relaxed">Due to an exceptionally high volume of orders, our shipping times may be delayed by 2-3 days beyond our usual lead times. We're working hard to get your order to you as quickly as possible and appreciate your understanding during this busy period.</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">Netherlands & Belgium: 2-3 working days (free over €100)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">Germany: 2-3 working days (free over €100)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">Rest of Europe: 4-8 working days (free over €150)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">Rest of the world: 4-8 working days (free over €150)</p>
              </div>
            </div>

            <p className="leading-relaxed">
              For more information please see our shipping page <Link to="/pages/shipping" className="underline">here</Link>.
            </p>
          </div>
        </Accordion>

        <Accordion title="14 DAY EASY RETURNS">
          <div className="space-y-4">
            <p className="leading-relaxed">
              We offer a 14 day return or exchange policy if you are not happy with your order for any reason. 
              For more information please see our Return Policy <Link to="/pages/returns" className="underline">here</Link>.
            </p>
          </div>
        </Accordion>
      </div>

    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
