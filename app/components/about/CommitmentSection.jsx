import {Image} from '@shopify/hydrogen';
import {useTranslation} from '~/hooks/useTranslation';
import commitmentImage from '../../assets/about-us/OUR-ONGOING-COMMITMENT.jpg';

export function CommitmentSection() {
  const {t} = useTranslation();

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">{t('about.commitment.title')}</span>
              <p className="text-gray-600">
                {t('about.commitment.description')}
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
