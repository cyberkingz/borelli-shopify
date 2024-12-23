import wrinkleFreeGif from '../assets/Wrinkle-free.gif';
import noOdorGif from '../assets/no-odor.gif';
import flexibilityImg from '../assets/Maximum-flexibility.webp';
import breathableImg from '../assets/Breathable-and-fast-drying.webp';

export function ProductFeatures() {
  const features = [
    {
      image: wrinkleFreeGif,
      title: 'Wrinkle Free',
      description: 'Maintains a crisp, fresh look without ironing'
    },
    {
      image: noOdorGif,
      title: 'No Odor',
      description: 'Advanced fabric technology prevents odor buildup'
    },
    {
      image: flexibilityImg,
      title: 'Maximum Flexibility',
      description: 'Moves with you for unrestricted comfort'
    },
    {
      image: breathableImg,
      title: 'Breathable',
      description: 'Keeps you cool and dry throughout the day'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-6">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
