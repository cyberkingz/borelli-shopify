import {Link} from '@remix-run/react';
import ctaBackground from '../../assets/about-us/CTA-BANNER.png';
import { useLocale } from '../UseLocale';

export function CTASection() {
   const getPrefix = useLocale();
  return (
    <div className="relative py-32">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `url(${ctaBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-white flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
          DESIGNED IN AMSTERDAM.<br />
          DELIVERED WORLDWIDE.
        </span>
        <Link
          to={`${getPrefix?.pathPrefix ? getPrefix?.pathPrefix : ''}/collections/all`}
          className="inline-block bg-transparent border border-white text-white px-12 py-3 font-medium rounded-none hover:bg-white hover:text-black transition-all duration-300"
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
}
