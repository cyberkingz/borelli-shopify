import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';

export function AnnouncementBar() {
  return (
    <div className="bg-[#2B555A] text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
          <button>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          <p className="text-sm font-medium">
            FREE SHIPPING ON ORDERS ABOVE €150
          </p>
          
          <button>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
