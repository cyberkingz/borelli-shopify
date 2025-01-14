import {useRef} from 'react';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

export function RecommendedProducts({products}) {
  const {t} = useTranslation();
  const scrollContainerRef = useRef(null);

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

  if (!products?.length) return null;

  return (
    <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] bg-[#F2F2F2] overflow-x-hidden">
      <div className="py-16">
        <div>
          <div className="text-left pl-6 mb-10">
            <span className="text-4xl font-bold mb-2">{t('product.recommendations.title')}</span>
            <p className="text-gray-600">{t('product.recommendations.subtitle')}</p>
          </div>

          <div className="relative">
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Products Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-6"
            >
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.handle}`}
                  className="group relative flex-none w-[calc((100vw-32px)/2)] md:w-[calc((100vw-48px)/4)] snap-start"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
                    {/* Recommended Badge */}
                    <div className="absolute left-0 top-0 z-10 leading-none">
                      <span className="inline-block bg-[#545252] text-white text-xs px-2 py-1">
                        {t('product.recommendations.badge')}
                      </span>
                    </div>
                    
                    {product.images?.nodes[0] && (
                      
                      <Image
                        data={product.images.nodes[0]}
                        alt={product.title}
                        width={1000}
                        height={1000}
                        className="absolute h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-medium mb-1 group-hover:text-gray-800 transition-colors">
                    {product.title}
                  </h3>
                  <Money 
                    data={product.priceRange.minVariantPrice}
                    className="text-gray-900"
                  />
                </Link>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
