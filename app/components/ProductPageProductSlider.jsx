import {Link, useLocation} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useRef} from 'react';
import {useTranslation} from '~/hooks/useTranslation';
import {getMarketByLocale} from '~/config/markets';
import { useLocale } from './UseLocale';

export function ProductPageProductSlider({products = []}) {
  const {t} = useTranslation();
  const location = useLocation();
  const [, locale] = location.pathname.split('/');
  const market = getMarketByLocale(locale);
  const scrollContainerRef = useRef(null);
  const getPrefix = useLocale();
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' 
      ? -container.offsetWidth 
      : container.offsetWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const formatPrice = (amount, currencyCode) => {
    return new Intl.NumberFormat(market.defaultLocale, {
      style: 'currency',
      currency: market.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!products?.length) {
    return null;
  }

  return (
    <section className="w-full py-24">
      <div className="w-screen relative -ml-[calc((100vw-100%)/2)] mb-12">
        <div className="pl-[calc((100vw-100%)/2)] ml-4 pt-4 px-4 lg:px-0 flex flex-col justify-start lg:justify-center align-center lg:align-start">
          <span className="text-3xl font-bold uppercase mb-4 text-center lg:text-left">{t('product.recommendations.title')}</span>
          <p className="text-gray-600 text-center lg:text-left">{t('product.recommendations.subtitle')}</p>
        </div>
      </div>

      <div className="w-screen relative -ml-[calc((100vw-100%)/2)] overflow-hidden">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-4 shadow-xl hover:bg-gray-50 transition-colors"
          aria-label={t('product.slider.prev')}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide pl-[calc((100vw-100%)/2)] pr-4"
        >
          {products.map((product) => {
            const price = product.priceRange.minVariantPrice;

            return (
              <Link
                key={product.id}
                className="group relative flex-none w-[calc((100vw-32px)/2)] md:w-[calc((100vw-48px)/4)] snap-start"
                to={`${getPrefix?.pathPrefix ? getPrefix?.pathPrefix : ''}/products/${product.handle}`}
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                  <div className="absolute left-0 top-0 z-10">
                    <span className="inline-block bg-black text-[10px] px-2 py-1 text-white uppercase tracking-wider">
                      {t('product.newStyle')}
                    </span>
                  </div>
                  <Image
                    data={product.featuredImage}
                    className="absolute h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 50vw"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium uppercase">
                    {product.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span>
                      {formatPrice(price.amount, price.currencyCode)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-4 shadow-xl hover:bg-gray-50 transition-colors"
          aria-label={t('product.slider.next')}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      
    </section>
  );
}
