import {useState, useRef, useEffect} from 'react';
import video1 from '../assets/video/videoslider/barkerlondon-video-1.mp4';
import video2 from '../assets/video/videoslider/barkerlondon-video-2.mp4';
import video3 from '../assets/video/videoslider/barkerlondon-video-3.mp4';
import video4 from '../assets/video/videoslider/barkerlondon-video-4.mp4';
import video5 from '../assets/video/videoslider/barkerlondon-video-5.mp4';
import leftBar from '../assets/video-slider/left-bar.png';
import rightBar from '../assets/video-slider/right-bar.png';

export function VideoSlider() {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(2);
  const scrollTimeout = useRef(null);

  // Create a longer array for continuous scrolling
  const originalVideos = [video1, video2, video3, video4, video5];
  const videos = [...originalVideos, ...originalVideos, ...originalVideos, ...originalVideos];

  useEffect(() => {
    // Initial center alignment
    if (sliderRef.current) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Start from second video on mobile
        setCurrentIndex(1);
        const videoWidth = 253; // Width of main video
        const gap = 32; // 8rem gap
        // Calculate exact position for second video
        const initialScrollLeft = videoWidth + gap;
        requestAnimationFrame(() => {
          sliderRef.current.scrollLeft = initialScrollLeft;
        });
      } else {
        // Desktop behavior remains the same
        setCurrentIndex(2);
        sliderRef.current.scrollLeft = 0;
      }
    }

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (sliderRef.current) {
        const scrollLeft = sliderRef.current.scrollLeft;
        const containerWidth = sliderRef.current.clientWidth;
        const videoWidth = 253; // Width of main video
        const gap = 32; // 8rem gap

        // Calculate which video should be centered
        const centerPosition = scrollLeft + containerWidth / 2;
        const estimatedIndex = Math.round(centerPosition / (videoWidth + gap));
        
        if (estimatedIndex !== currentIndex && estimatedIndex >= 0 && estimatedIndex < videos.length) {
          scrollToIndex(estimatedIndex);
        }
      }
    }, 150); // Debounce time
  };

  const handleSlide = (direction) => {
    const totalVideos = videos.length;
    let newIndex = direction === 'left'
      ? (currentIndex - 1 + totalVideos) % totalVideos
      : (currentIndex + 1) % totalVideos;
    scrollToIndex(newIndex);
  };

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
    if (sliderRef.current) {
      const newActiveVideo = sliderRef.current.children[index];
      if (newActiveVideo) {
        const scrollLeft = newActiveVideo.offsetLeft - (sliderRef.current.clientWidth - newActiveVideo.offsetWidth) / 2;
        sliderRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="relative w-full my-16 pb-4">
      
      {/* Headline */}
      <div className="flex flex-col items-center mb-16 gap-2 md:gap-4">
        
        <div className="flex flex-row items-center gap-2 md:gap-4">
          <img src={leftBar} alt="left bar" className="w-[60px] md:w-[100px]" />
          <span className="text-2xl md:text-4xl text-center uppercase font-bold">the old money <br/>community</span>
          <img src={rightBar} alt="left bar" className="w-[60px] md:w-[100px]" />
        </div>

        <p className="text-sm md:text-base text-gray-600 text-center px-4 md:px-0">
          With over 75.000+ global customers, the old money community is bigger than ever before.
        </p>
      
      </div>
    
      <div 
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-8 max-w-[1400px] mx-auto overflow-x-auto scrollbar-hide scroll-smooth items-center"
        style={{ 
          scrollBehavior: 'smooth',
          paddingLeft: '20px',
          paddingRight: 'calc(50% - 126px)',
          height: '450px' // Fixed height based on the largest video height
        }}
      >
        {videos.map((video, index) => (
          <div 
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`relative flex-none transition-all duration-500 ease-in-out cursor-pointer ${
              index === currentIndex 
                ? 'w-[253px] h-[450px] scale-100 opacity-100 z-10' 
                : 'w-[225px] h-[400px] scale-90 opacity-70 z-0 hover:opacity-90'
            }`}
            style={{
              transform: `${index === currentIndex ? 'scale(1)' : 'scale(0.9)'}`,
              transformOrigin: 'center center'
            }}
          >
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={() => handleSlide('left')}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all z-10"
        style={{ backgroundColor: '#2B555A' }}
        aria-label="Previous video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        onClick={() => handleSlide('right')}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all z-10"
        style={{ backgroundColor: '#2B555A' }}
        aria-label="Next video"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
