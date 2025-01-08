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
import { ProductDuoOptions } from './ProductDuoOptions';
import { useEffect } from 'react';

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
export function ProductForm({
  productOptions, 
  product, 
  selectedVariant, 
  firstSelectedVariant, 
  setFirstSelectedVariant, 
  secondSelectedVariant, 
  setSecondSelectedVariant, 
  title, 
  vendor, 
  douSelected, 
  setDouSelected, 
  firstSelectedOptions, 
  setFirstSelectedOptions, 
  secondSelectedOptions, 
  setSecondSelectedOptions, 
  douTotalPrice, 
  setDouTotalPrice, 
  percentageSaved, 
  setPercentageSaved, 
  douTotalComparePrice, 
  setDouTotalComparePrice,
  addedToCart,
  setAddedToCart,
  singleSelectedVariant,
  setSingleSelectedVariant,
  singleSelectedOptions,
  setSingleSelectedOptions  
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const onChangeHandler = (event) => {
    if(event.target.dataset.optionIndex === '1') {
    
      const NewValues = firstSelectedOptions.map(item => {
        if (item.name === event.target.dataset.optionName) {
          return { ...item, value: event.target.options[event.target.selectedIndex].value };
        }
        return item;
      });   
      setFirstSelectedOptions(NewValues);
      const normalizedNewValues = JSON.stringify(NewValues).replace(/\s+/g, '').toLowerCase();
      product.variants.nodes.map(node => {
        const normalizedSelectedOptions = JSON.stringify(node?.selectedOptions).replace(/\s+/g, '').toLowerCase();
        if(normalizedSelectedOptions === normalizedNewValues) {
          setFirstSelectedVariant(node);
          const discountAmount = parseFloat(node?.compareAtPrice?.amount) - parseFloat(node?.price?.amount);
          const discountPercentage = (discountAmount / 100) * 100;
          setPercentageSaved(parseInt(discountPercentage));
          const totalAmount = parseFloat(node?.price?.amount) + parseFloat(node?.price?.amount);
          setDouTotalPrice({amount: totalAmount.toLocaleString(), currencyCode: node?.price?.currencyCode });
          const totalCompareAmount = parseFloat(node?.compareAtPrice?.amount) + parseFloat(node?.compareAtPrice?.amount);
          setDouTotalComparePrice({amount: totalCompareAmount.toLocaleString(), currencyCode: node?.compareAtPrice?.currencyCode });
        }
      })   
    }
    if(event.target.dataset.optionIndex === '2') {
      const NewValues = secondSelectedOptions.map(item => {
        if (item.name === event.target.dataset.optionName) {
          return { ...item, value: event.target.options[event.target.selectedIndex].value };
        }
        return item;
      });      
      setSecondSelectedOptions(NewValues);
      const normalizedNewValues = JSON.stringify(NewValues).replace(/\s+/g, '').toLowerCase();
      product.variants.nodes.map(node => {
        const normalizedSelectedOptions = JSON.stringify(node?.selectedOptions).replace(/\s+/g, '').toLowerCase();
        if(normalizedSelectedOptions === normalizedNewValues) {
          setSecondSelectedVariant(node);
          const discountAmount = parseFloat(node?.compareAtPrice?.amount) - parseFloat(node?.price?.amount);
          const discountPercentage = (discountAmount / 100) * 100;
          setPercentageSaved(parseInt(discountPercentage));
          const totalAmount = parseFloat(node?.price?.amount) + parseFloat(node?.price?.amount);
          setDouTotalPrice({amount: totalAmount.toLocaleString(), currencyCode: node?.price?.currencyCode });
          const totalCompareAmount = parseFloat(node?.compareAtPrice?.amount) + parseFloat(node?.compareAtPrice?.amount);
          setDouTotalComparePrice({amount: totalCompareAmount.toLocaleString(), currencyCode: node?.compareAtPrice?.currencyCode });
        }
      })   
    }
  }

  useEffect(() => {
    if(addedToCart === 'loading') {
      setDouSelected('single');
    }

  },[addedToCart])

  return (
    <div className="flex flex-col gap-6">
      {/* Product Title */}
      <span className="text-3xl font-bold m-0 mt-0">{title}</span>

      {/* Price */}
      <div className="flex items-center gap-2">
        {selectedVariant?.compareAtPrice && (
          <Money
            data={selectedVariant.compareAtPrice}
            className="text-3xl text-gray-500 line-through"
          />
        )}
        <Money 
          data={selectedVariant?.price}
          className="text-3xl font-semibold"
        />
       {percentageSaved > 0  && (
        <div className="bg-[#2B555A] text-white py-1 px-2 text-[12px] uppercase">
          {`Save ${parseInt(percentageSaved)}%`}
        </div>
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
              singleSelectedVariant={singleSelectedVariant}
              setSingleSelectedVariant={setSingleSelectedVariant}
              singleSelectedOptions={singleSelectedOptions}
              setSingleSelectedOptions={setSingleSelectedOptions}
              product={product}
            />
          </div>
        ))}
      </div>
      {/* Bundle Functionality */}
      <div className="product-page-bundle">
        <label className={douSelected === 'single' ? `single active` : `single`} htmlFor="single-bundle">
            <div className="radio">
            <input type="radio" name="bundle-option" value="single" id="single-bundle" checked={douSelected === 'single'} onChange={() => setDouSelected('single')} />
            </div>
            <div className="content">
              <span className="heading">SINGLE</span>
              <span className="sub-heading">Standard Price</span>
            </div>
            <div className="pricing">
              <div className="price">
                <Money 
                  data={selectedVariant?.price}
                  className="text-1xl font-semibold"
                />
              </div>
              <div className="compare-at-price">
                {selectedVariant?.compareAtPrice && (
                  <Money
                    data={selectedVariant.compareAtPrice}
                    className="text-1xl text-red-500 line-through"
                  />
                )}
              </div>
            </div>
        </label>
        <label className={douSelected === 'double' ? `dou active` : `dou`} htmlFor="duo-bundle">
            <div className="bundle-badge">BEST VALUE</div>
            <div className="radio">
            <input type="radio" name="bundle-option" value="duo" id="duo-bundle" checked={douSelected === 'double'} onChange={() => setDouSelected('double')} />
            </div>
            <div className="content">
              <span className="heading">DUO</span>
              {percentageSaved > 0 && (
                <span className="sub-heading">{`Save an extra ${percentageSaved}% per item`}</span>
              )}            
              {douSelected === 'double' && firstSelectedOptions && secondSelectedOptions && (
                  <div className="duo-options-container">
                  {/* First variant selection */}
                  <div className="dou-option">
                    {productOptions.map((option,index) => {
                      return(
                        <ProductDuoOptions 
                          key={`option-${index}`} 
                          option={option} 
                          optionIndex={1} 
                          onChangeHandler={onChangeHandler} 
                          />
                      )
                    })}
                  </div>
                  {/* Second variant selection */}
                  <div className="dou-option">
                    {productOptions.map((option,index) => {
                      return(
                        <ProductDuoOptions 
                          key={`option-${index}`} 
                          option={option} 
                          optionIndex={2} 
                          onChangeHandler={onChangeHandler}
                          />
                      )
                    })}
                  </div>
                  </div>
              )}
            </div>
            <div className="pricing">
              <div className="price">
                {douTotalPrice && (
                    <Money 
                    data={douTotalPrice}
                    className="text-1xl font-semibold"
                    />
                )}               
              </div>
              <div className="compare-at-price">
                {parseFloat(douTotalComparePrice?.amount) > parseFloat(douTotalPrice?.amount) && (
                  <Money
                    data={douTotalComparePrice}
                    className="text-1xl text-red-500 line-through"
                  />
                )}
              </div>
            </div>
        </label>
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
          disabled={!singleSelectedVariant || !singleSelectedVariant.availableForSale}
          onClick={() => open('cart')}
          lines={
            douSelected === 'single' && singleSelectedVariant
              ? [
                  {
                    merchandiseId: singleSelectedVariant.id,
                    quantity: 1,
                  },
                ]
            : douSelected === 'double' && firstSelectedVariant && secondSelectedVariant
              ? [
                {
                  merchandiseId: firstSelectedVariant?.id,
                  quantity: 1,
                },
                {
                  merchandiseId: secondSelectedVariant?.id,
                  quantity: 1,
                },
                ]
            : []
          }
          addedToCart={addedToCart}
          setAddedToCart={setAddedToCart}
          className="!bg-black hover:!bg-gray-900 !w-full"
        >
          {douSelected === 'single' && selectedVariant?.availableForSale ? 'Add to Cart' : douSelected === 'single' && 'Sold Out'}
          {douSelected === 'double' && firstSelectedVariant?.availableForSale && secondSelectedVariant?.availableForSale ? 'Add to Cart' : douSelected === 'double' && 'Sold Out'}
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
