import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

export function FacebookPixel() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize with your Pixel ID
    fbq('init', '9441636952533644');
    
    // Track PageView
    fbq('track', 'PageView');
  }, [location]); // Re-run when location changes

  return (
    <>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=9441636952533644&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}
