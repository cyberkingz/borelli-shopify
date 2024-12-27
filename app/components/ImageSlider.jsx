import {useState, useRef, useEffect} from 'react';
import image1 from '../assets/image-slider/image-1.jpeg';
import image2 from '../assets/image-slider/image-2.jpeg';
import image3 from '../assets/image-slider/image-3.jpeg';
import image4 from '../assets/image-slider/image-4.jpeg';
import image5 from '../assets/image-slider/image-5.jpeg';
import leftBar from '../assets/video-slider/left-bar.png';
import rightBar from '../assets/video-slider/right-bar.png';

export function ImageSlider() {
  const [position, setPosition] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const sliderRef = useRef(null);

  // Create base array of images
  const images = [image1, image2, image3, image4, image5];
  const imageWidth = typeof window !== 'undefined' ? window.innerWidth / 4.5 : 300;
  
  // Create three sets of images for smooth infinite scroll
  const displayImages = [...images, ...images, ...images];

  useEffect(() => {
    let animationId;
    let lastTimestamp = 0;
    const speed = 1; // pixels per frame

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > 16) { // Cap at roughly 60fps
        setPosition(prev => {
          const newPosition = prev - speed;
          const maxScroll = -(images.length * imageWidth);
          
          // If we've scrolled past one set of images
          if (newPosition <= maxScroll) {
            // Reset to start but adjust for the overshoot
            const overshoot = newPosition - maxScroll;
            return overshoot;
          }
          
          return newPosition;
        });
        lastTimestamp = timestamp;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [images.length, imageWidth]);

  return (
    <section className="w-full my-24">
      {/* Headline */}
      <div className="flex flex-col items-center mb-16 gap-4 md:gap-6">
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <img src={leftBar} alt="left bar" className="w-[80px] md:w-[120px]" />
          <span className="text-3xl md:text-5xl text-center uppercase font-bold">
            The Barker's<br/>community
          </span>
          <img src={rightBar} alt="left bar" className="w-[80px] md:w-[120px]" />
        </div>

        <p className="text-base md:text-lg text-gray-600 text-center px-4 md:px-0">
          With over <strong>75.000+</strong> global customers, the old money community is bigger than ever before.
        </p>
      </div>

      {/* Full-width slider container */}
      <div className="w-screen relative -ml-[50vw] left-1/2 overflow-hidden">
        <div 
          ref={sliderRef}
          className="flex gap-2"
          style={{ 
            transform: `translateX(${position}px)`,
            transition: isResetting ? 'none' : 'transform 100ms linear',
            width: 'max-content'
          }}
        >
          {displayImages.map((image, index) => (
            <div 
              key={index}
              className="w-[calc((100vw-4px)/2)] md:w-[calc((100vw-6px)/4.5)] h-[300px] md:h-[400px] inline-block rounded-none"
            >
              <img 
                src={image}
                alt={`Community image ${(index % images.length) + 1}`}
                className="w-full h-full object-cover rounded-none"
                style={{ borderRadius: '0' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
