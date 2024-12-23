import {Image} from '@shopify/hydrogen';
import desktopBanner from '../../assets/about-us/desktop-banner.png';
import mobileBanner from '../../assets/about-us/mobile-banner.png';

export function HeroSection() {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopBanner} />
          <Image
            src={mobileBanner}
            className="w-full h-full object-cover"
            alt="Borelli clothing banner"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="text-6xl font-bold text-white mb-6">OUR STORY</span>
          <p className="text-xl text-white/90">
            CRAFTING THE PERFECT FIT FOR MEN SINCE 2018
          </p>
        </div>
      </div>
    </div>
  );
}
