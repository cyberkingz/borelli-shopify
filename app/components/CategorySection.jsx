import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {ChevronRightIcon} from '@heroicons/react/24/outline';

export function CategorySection({categories}) {
  return (
    <section className="py-16 px-4">
      <span className="text-3xl font-bold uppercase mb-4">SHOP OUR TOP CATEGORIES</span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {categories.map((category) => (
          <Link 
            key={category.handle} 
            to={`/collections/${category.handle}`}
            className="relative group block category-card"
          >
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              {category.image && (
                <Image
                  data={category.image}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl md:text-2xl font-bold tracking-wider text-center px-4">
                  {category.title}
                </span>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-1/3 left-[calc(50%-24px)]">
                <div className="category-arrow bg-white rounded-full w-12 h-12 flex items-center justify-center">
                  <ChevronRightIcon className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
