import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

export function ProductGallery({images = [], title, selectedVariant}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const {t} = useTranslation();

  // Update selected image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      const variantImageIndex = images.findIndex(img => img.url === selectedVariant.image.url);
      if (variantImageIndex >= 0) {
        setSelectedImage(variantImageIndex);
      }
    }
  }, [selectedVariant, images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {/* NEW STYLE Badge */}
        <div className="absolute left-0 top-0 z-[5]">
          <span className="inline-block bg-black text-white text-xs px-2 py-1">{t('product.newStyle')}</span>
        </div>

        <img
          src={images[selectedImage].url}
          alt={images[selectedImage].altText || title}
          className="h-full w-full object-cover"
          width={images[selectedImage].width}
          height={images[selectedImage].height}
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="relative mt-4">
        {/* Previous button */}
        <button
          onClick={() => {
            const container = document.querySelector('[data-thumbnail-container]');
            if (container) {
              container.scrollBy({ left: -80, behavior: 'smooth' });
            }
          }}
          className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white p-1.5 shadow-sm transition-all hover:border-black/30 hover:shadow-md disabled:opacity-0"
          aria-label="Previous thumbnails"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-black/60">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="overflow-x-auto scrollbar-hide scroll-smooth px-6" data-thumbnail-container>
          <div className="flex gap-2 pb-2 pt-2" style={{ width: 'max-content' }}>
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setSelectedImage(index);
                  // Scroll thumbnail into view when selected
                  const thumbnail = document.querySelector(`[data-thumbnail-index="${index}"]`);
                  thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                data-thumbnail-index={index}
                className={`
                  relative flex-shrink-0 aspect-[3/4] w-20 overflow-hidden rounded-sm bg-gray-100
                  transition-all duration-300 ease-in-out
                  ${selectedImage === index 
                    ? 'ring-1 ring-black shadow-lg' 
                    : 'hover:ring-1 hover:ring-black/20'
                  }
                `}
                style={{ maxWidth: 'calc(25% - 6px)' }}
              >
                <img
                  src={image.url}
                  alt={image.altText || `Product image ${index + 1}`}
                  className={`
                    h-full w-full object-cover
                    transition-opacity duration-300
                    ${selectedImage === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                  `}
                />
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-black/5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={() => {
            const container = document.querySelector('[data-thumbnail-container]');
            if (container) {
              container.scrollBy({ left: 80, behavior: 'smooth' });
            }
          }}
          className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/10 bg-white p-1.5 shadow-sm transition-all hover:border-black/30 hover:shadow-md disabled:opacity-0"
          aria-label="Next thumbnails"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-black/60">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}
