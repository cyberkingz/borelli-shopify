import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';

export function BestsellerSection({collection}) {
  const {t} = useTranslation();

  return (
    <section className="relative w-screen -ml-[50vw] left-1/2 h-[650px] md:h-[600px] my-16 mt-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        {collection?.image && (
          <Image
            data={collection.image}
            className="w-full h-full object-cover ![border-radius:0] md:object-[center_center] object-[90%_center]"
            sizes="100vw"
            loading="lazy"
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center z-20">
        <div className="w-full px-4 max-w-[1800px] mx-auto">
          <div className="backdrop-blur-sm bg-white/80 sm:p-16 p-10 sm:ml-10 ml-0 max-w-xl flex flex-col gap-6 shadow-2xl border border-white/20 transition-all duration-300 hover:backdrop-blur-md">
            {/* Small Decorative Line */}
            <div className="w-20 h-0.5 bg-black/80 mb-1"></div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <span className="text-2xl md:text-2xl lg:text-4xl font-bold leading-tight tracking-tight">
                {t('bestseller.title')}
              </span>
              <p className="text-gray-700/90 text-sm md:text-base leading-relaxed">
                {t('bestseller.description')}
              </p>
            </div>

            {/* Button with Enhanced Styling */}
            <div className="pt-4">
              <Link 
                to="/collections/best-selling"
                className="group relative inline-block bg-black/95 text-white px-10 py-4 uppercase text-sm tracking-widest font-medium hover:bg-black transition-all duration-300 w-fit hover:shadow-xl"
              >
                <span className="relative z-10">{t('bestseller.cta')}</span>
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
