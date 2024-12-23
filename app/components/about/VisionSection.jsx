import {Image} from '@shopify/hydrogen';
import visionImage from '../../assets/about-us/OUR-VISION.png';

export function VisionSection() {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src={visionImage}
                className="w-full rounded-lg"
                alt="Man wearing Borelli clothing"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">OUR VISION</span>
              <p className="text-gray-600">
                Our vision is simple yet powerful: to offer the perfect fit, premium quality
                clothing that every self-care-conscious man deserves. We continually
                innovate and elevate our offerings, ensuring that every item we create
                embodies our commitment to the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
