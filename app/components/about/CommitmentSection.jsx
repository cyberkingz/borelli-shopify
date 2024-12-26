import {Image} from '@shopify/hydrogen';
import commitmentImage from '../../assets/about-us/OUR-ONGOING-COMMITMENT.jpg';

export function CommitmentSection() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">OUR ONGOING COMMITMENT</span>
              <p className="text-gray-600">
                We're dedicated to providing premium quality clothing that fits perfectly and
                remains affordable. We believe clothing should empower you to effortlessly
                express your unique identity. Our garments cater to self-care-conscious
                men with dynamic lives, balancing social engagements, fitness pursuits, and
                a quest for style and comfort, seamlessly blending quality with affordability.
              </p>
            </div>
            <div>
              <Image
                src={commitmentImage}
                className="w-full rounded-lg"
                alt="Man wearing Borelli clothing showing our commitment to quality"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
