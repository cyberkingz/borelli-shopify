import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export function BestsellerSection({collection}) {
  return (
    <section className="relative w-screen -ml-[50vw] left-1/2 h-[600px] md:h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {collection?.image && (
          <Image
            data={collection.image}
            className="w-full h-full object-cover ![border-radius:0]"
            sizes="100vw"
            loading="lazy"
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="w-full px-4 max-w-[1800px] mx-auto">
          <div className="bg-white sm:p-20 p-12 sm:ml-10 ml-0 max-w-xl flex flex-col gap-6">
            <span className="text-2xl md:text-2xl lg:text-4xl font-bold">
              The sky is not the limit, the limit is your vision.
            </span>
            <p className="text-gray-600 text-sm md:text-base">
              In just a few years, the Amsterdam-based label is now part of the Dutch 
              capital's burgeoning streetwear scene and a leading global destination for 
              the latest perfect fitting menswear.
            </p>
            <div>
              <Link 
                to="/collections/best-selling"
                className="inline-block bg-black text-white px-8 py-3 uppercase text-sm tracking-wider font-medium hover:bg-gray-800 transition-colors w-fit"
              >
                Shop bestsellers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
