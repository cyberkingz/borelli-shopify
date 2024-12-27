import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function BundleSection({collection}) {
  return (
    <section className="w-full py-16 px-4 ">
      <div className="max-w-[1800px] mx-auto bg-[#906e5c36]">
        <div className="grid md:grid-cols-2 gap-0 items-center">
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
          <div className="flex flex-col justify-center items-center text-center space-y-6 p-8 md:p-12 lg:p-16 gap-4">
            <span className="text-sm uppercase tracking-wider my-0">SAVE BIG</span>
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight my-0">
              Bundle Up for the Holidays
            </span>
            <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
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
