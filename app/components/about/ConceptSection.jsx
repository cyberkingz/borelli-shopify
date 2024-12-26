import {Image} from '@shopify/hydrogen';
import conceptImage from '../../assets/about-us/FROM-CONCEPT-TO-CREATION.jpg';

export function ConceptSection() {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          {/* Introduction text */}
          <p className="text-center text-gray-600 mb-20 max-w-3xl mx-auto">
            Established in 2018, BORELLI is all about standing out from the crowd and staying unique. In
            just a few years, we have become part of the modern menswear scene and a leading destination for the latest menswear.
          </p>

          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src={conceptImage}
                className="w-full rounded-lg"
                alt="Borelli design process"
              />
            </div>
            <div>
              <span className="text-4xl font-bold mb-8 flex flex-col gap-4">FROM CONCEPT TO CREATION</span>
              <p className="text-gray-600 mb-6">
                What began as a quest to design the perfect pair of trousers has evolved
                into a global menswear brand. Today, BORELLI offers a
                comprehensive range of sophisticated, versatile garments that redefine
                contemporary fashion.
              </p>
              <p className="text-gray-600">
                With their unwavering commitment to excellence,
                we continue to inspire confidence and individuality in men
                worldwide, establishing BORELLI as a symbol of style, quality,
                and innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
