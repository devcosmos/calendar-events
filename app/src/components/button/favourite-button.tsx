import { useRef } from 'react';

import { postEvent } from '@tma.js/sdk-react';
import clsx from 'clsx';

import Button from '@components/button/button';
import { Star } from '@components/icon/custom';

import { useFavouritesStore } from '@store/favouritesStore';

import { ButtonSize } from '@utils/consts';
import { SwimEvent } from '@utils/types';

interface FavouriteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  SwimEvent: SwimEvent;
  size?: ButtonSize;
}

export default function FavouriteButton({ SwimEvent, size = ButtonSize.Base }: FavouriteButtonProps) {
  const starRef = useRef<HTMLElement>(null);

  const { isFavourite, addFavourite, removeFavourite } = useFavouritesStore();

  const isFavouriteEntity = isFavourite(SwimEvent);

  const handleFavouriteButtonClick = () => {
    if (starRef.current) {
      const star = starRef.current;

      star.classList.add('animate-[scaling_0.5s]');

      const handleAnimationEnd = () => {
        star.classList.remove('animate-[scaling_0.5s]');
        star.removeEventListener('animationend', handleAnimationEnd);
      };

      star.addEventListener('animationend', handleAnimationEnd);
    }

    postEvent('web_app_trigger_haptic_feedback', { type: 'selection_change' });

    if (isFavouriteEntity) {
      removeFavourite(SwimEvent);
    } else {
      addFavourite(SwimEvent);
    }
  };

  return (
    <Button
      className={clsx(
        'bg-tg-section-bg-color border-tg-section-bg-color text-sm  !rounded-2xl !w-auto like-button',
        size === ButtonSize.Medium ? '!p-4' : '!p-3.5',
      )}
      onClick={handleFavouriteButtonClick}
    >
      <span ref={starRef} className="origin-center will-change-transform">
        <Star
          width="29"
          height="27"
          className={clsx('group', size === ButtonSize.Medium && 'size-6', isFavouriteEntity && 'scaling')}
        />
      </span>
    </Button>
  );
}
