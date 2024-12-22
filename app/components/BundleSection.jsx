import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function BundleSection({collection}) {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image - Order changed for mobile */}
          <div className="relative aspect-square w-full overflow-hidden md:order-last">
            {collection.image && (
              <div className="group h-full">
                <Image
                  data={collection.image}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center items-center text-center space-x-6 px-4 md:px-8 lg:px-16 gap-4">
            <span className="text-sm uppercase tracking-wider">SAVE BIG</span>
            <span className="text-5xl md:text-6xl font-bold">
              Bundle Up for the Holidays
            </span>
            <p className="text-sm text-gray-600 max-w-xl">
              Explore our exclusive holiday bundles, offering extra style and unbeatable 
              savings. Perfect for gifting or elevating your own wardrobe.
            </p>
            <Link 
              to={`/collections/${collection.handle}`}
              className="inline-block bg-black text-white px-8 py-4 uppercase text-sm tracking-wider font-medium hover:bg-gray-800 transition-colors w-fit"
            >
              SAVE NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
