import {Link, useNavigate} from '@remix-run/react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {Money} from '@shopify/hydrogen';
import {ProductOptions} from './ProductOptions';
import {useTranslation} from '~/hooks/useTranslation';

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
  const {t} = useTranslation();
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
          {t('product.discount', { amount: parseInt(percentageSaved) })}
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
              <span className="heading">{t('product.bundle.single')}</span>
              <span className="sub-heading">{t('product.bundle.standardPrice')}</span>
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
            <div className="bundle-badge">{t('product.bundle.bestValue')}</div>
            <div className="radio">
            <input type="radio" name="bundle-option" value="duo" id="duo-bundle" checked={douSelected === 'double'} onChange={() => setDouSelected('double')} />
            </div>
            <div className="content">
              <span className="heading">{t('product.bundle.duo')}</span>
              {percentageSaved > 0 && (
                <span className="sub-heading">
                  {t('product.bundle.saveExtra', {percent: percentageSaved})}
                </span>
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
          alt={t('product.guarantee.moneyBack')}
          className="w-5 h-5"
        />
        <span>{t('product.guarantee.moneyBack')}</span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 mt-2">
        {selectedVariant?.availableForSale ? (
          <>
            <div className="relative">
              <div className="w-2 h-2 bg-orange-500 rounded-full pulse-dot"></div>
              <div className="absolute -inset-1 bg-orange-500/30 rounded-full animate-ping"></div>
            </div>
            <p className="text-orange-500 text-sm font-medium">
              {t('product.inventory.lowStock')}
            </p>
          </>
        ) : (
          <p className="text-red-500 text-sm font-medium">
            {t('product.inventory.outOfStock')}
          </p>
        )}
      </div>

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
        <Accordion title={t('product.accordion.description')} defaultOpen={true}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-medium text-black text-[16px]">{t('product.accordion.productDetails.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('product.accordion.productDetails.description')}
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">{t('product.accordion.productDetails.features.cotton')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">{t('product.accordion.productDetails.features.feel')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <span className="leading-relaxed">{t('product.accordion.productDetails.features.fit')}</span>
              </li>
            </ul>
          </div>
        </Accordion>

        <Accordion title={t('product.accordion.shippingInfo')}>
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="font-medium">{t('product.accordion.shipping.update')}</p>
              <p className="leading-relaxed">{t('product.accordion.shipping.delay')}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">{t('product.accordion.shipping.times.benelux')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">{t('product.accordion.shipping.times.germany')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">{t('product.accordion.shipping.times.europe')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0 mt-2"></span>
                <p className="leading-relaxed">
                  {t('product.accordion.shipping.times.more')} <Link to="/pages/shipping" className="underline">{t('common.here')}</Link>.
                </p>
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion title={t('product.accordion.returnsPolicy.title')}>
          <div className="space-y-4">
            <p className="leading-relaxed">
              {t('product.accordion.returnsPolicy.text')} {t('product.accordion.returnsPolicy.more')} <Link to="/pages/returns" className="underline">{t('common.here')}</Link>.
            </p>
          </div>
        </Accordion>
      </div>

    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
