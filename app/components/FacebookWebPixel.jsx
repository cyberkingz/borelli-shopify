import { useEffect } from "react";

export function FacebookWebPixel() {
    useEffect(() => {
        // Define your nonce value (this should be the same nonce as in your CSP header)
        const nonceValue = '68a337223c3c97b6be0dff8539d2eca9'; // Replace with the actual nonce

        // Create the script element dynamically
        const script = document.createElement("script");

        // Set the nonce attribute
        script.nonce = nonceValue;

        // Set the inner HTML for the script
        script.innerHTML = `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '9441636952533644');
        fbq('track', 'PageView');`;

        // Append the script to the document head
        document.head.appendChild(script);

        // Clean up the script after component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return null;
}