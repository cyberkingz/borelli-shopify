import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

export function ProductGallery({images = [], title}) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {/* NEW STYLE Badge */}
        <div className="absolute left-0 top-0 z-[5]">
          <span className="inline-block bg-black text-white text-xs px-2 py-1">NEW STYLE</span>
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
        <div className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex gap-2 pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`
                  relative flex-shrink-0 aspect-[3/4] w-20 overflow-hidden rounded-sm bg-gray-100
                  transition-all duration-300 ease-in-out
                  ${selectedImage === index 
                    ? 'ring-2 ring-black shadow-lg scale-105' 
                    : 'hover:ring-1 hover:ring-black/50 hover:scale-[1.02]'
                  }
                `}
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
      </div>

      <style jsx>{`
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
