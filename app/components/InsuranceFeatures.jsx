import expressDelivery from '../assets/insurance/express-delivery.gif';
import buyNowPayLater from '../assets/insurance/buy-now-pay-later.gif';
import returnPolicy from '../assets/insurance/14-day-returns.gif';
import {useEffect, useRef, useState} from 'react';
import {useTranslation} from '~/hooks/useTranslation';

export function InsuranceFeatures() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const {t} = useTranslation();

  const features = [
    {
      titleKey: 'product.insurance.delivery.title',
      descriptionKey: 'product.insurance.delivery.description',
      image: expressDelivery,
    },
    {
      titleKey: 'product.insurance.payment.title',
      descriptionKey: 'product.insurance.payment.description',
      image: buyNowPayLater,
    },
    {
      titleKey: 'product.insurance.returns.title',
      descriptionKey: 'product.insurance.returns.description',
      image: returnPolicy,
    },
  ];

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const slideWidth = slider.clientWidth;
      const scrollPosition = slider.scrollLeft;
      const newSlide = Math.round(scrollPosition / slideWidth);
      
      if (newSlide !== currentSlide && newSlide >= 0 && newSlide < features.length) {
        setCurrentSlide(newSlide);
      }
    }
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const handleScrollDebounced = debounce(handleScroll, 50);
      slider.addEventListener('scroll', handleScrollDebounced, { passive: true });
      return () => slider.removeEventListener('scroll', handleScrollDebounced);
    }
  }, [currentSlide]);

  return (
    <div className="w-screen relative left-[50%] right-[50%] -mx-[50vw] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Slider */}
        <div className="block lg:!hidden">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex-none w-full snap-center px-4"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 mb-6">
                    <img 
                      src={feature.image} 
                      alt={t(feature.titleKey)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-2xl font-bold mb-3">{t(feature.titleKey)}</span>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dot Navigation */}
          <div className="flex justify-center gap-3 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-black! scale-100' 
                    : 'bg-gray-300 scale-75 hover:scale-90'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Row */}
        <div className="hidden lg:!flex justify-between items-start gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-6">
                <img 
                  src={feature.image} 
                  alt={t(feature.titleKey)}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold mb-3">{t(feature.titleKey)}</span>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
