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

  useEffect(() => {
    const animate = () => {
      setPosition(prev => prev - 1);
    };

    const animationInterval = setInterval(animate, 16);
    return () => clearInterval(animationInterval);
  }, []);

  // Create base array of images
  const images = [image1, image2, image3, image4, image5];
  
  // Create a long sequence of images that appears infinite
  const displayImages = [...images, ...images, ...images, ...images, ...images, ...images];

  return (
    <div className="relative w-full my-16">
      {/* Headline */}
      <div className="flex flex-col items-center mb-16 gap-2 md:gap-4">
        <div className="flex flex-row items-center gap-2 md:gap-4">
          <img src={leftBar} alt="left bar" className="w-[60px] md:w-[100px]" />
          <span className="text-2xl md:text-4xl text-center uppercase font-bold">
            The Barker's<br/>community
          </span>
          <img src={rightBar} alt="left bar" className="w-[60px] md:w-[100px]" />
        </div>

        <p className="text-sm md:text-base text-gray-600 text-center px-4 md:px-0">
          With over <strong>75.000+</strong> global customers, the old money community is bigger than ever before.
        </p>
      </div>

      {/* Full-width slider container */}
      <div className="relative w-screen -ml-[50vw] left-1/2 overflow-hidden">
        <div 
          className="flex gap-4"
          style={{ 
            transform: `translateX(${position}px)`,
            transition: 'transform 100ms linear'
          }}
        >
          {displayImages.map((image, index) => (
            <div 
              key={index}
              className="w-[350px] flex-shrink-0 rounded-none overflow-hidden"
            >
              <img 
                src={image}
                alt={`Community image ${(index % images.length) + 1}`}
                className="w-full h-[350px] object-cover rounded-none"
                style={{ borderRadius: 0 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
