import { useEffect } from 'react';

type Props = {
  refs?: any[];
  handler: (e: any) => void;
  condition?: boolean;
};

export function useOnClickOutside({ refs, handler, condition = true }: Props) {
  useEffect(() => {
    if (condition) {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (
          !refs?.length ||
          refs?.find((r) => r?.current?.contains(event?.target)) !== undefined
        )
          return;

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }
  }, [refs, handler, condition]);
}
