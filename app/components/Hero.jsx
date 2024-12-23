import { Link } from '@remix-run/react';
import { Suspense } from 'react';
import heroImage from '../assets/hero-banner.webp';

export function Hero() {
  return (
    <Suspense fallback={<div className="h-[600px] bg-black" />}>
      <section className="relative h-[600px] w-full home-hero">
        <div className="absolute inset-0 bg-black">
          <img
            src={heroImage}
            alt="Hero banner"
            className="h-full w-full object-cover opacity-100"
            loading="eager"
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end sm:pb-20 sm:pl-3">
          <div className="w-full mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-xl pl-4">
              {/* Headline Section */}
              <div className="space-y-4 flex flex-col gap-3 sm:space-y-6 w-full text-center sm:text-left">
                <p className="text-white text-base sm:text-lg uppercase tracking-wide">
                  Celebrate in Style
                </p>
                <h1 className="hero-heading text-white font-bold uppercase">
                  Holiday Sale
                </h1>
                <p className="text-white text-lg sm:text-xl">
                  Enjoy up to 65% off on seasonal favorites.
                </p>
                {/* Button Section */}
                <div className="w-full flex [&>*]:mx-auto sm:[&>*]:ml-0">
                  <Link
                    to="/collections"
                    className="border border-white text-white px-8 py-3 uppercase transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
}
