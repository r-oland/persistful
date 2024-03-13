import { useEffect, useState } from 'react';

export const useDimensions = (
  targetRef: React.RefObject<HTMLDivElement>,
  dependencies: any[] = []
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Bit of a hack to trigger the component to re-render if the ref is null
    if (!targetRef.current) return setDimensions({ width: 0, height: 0 });

    setDimensions({
      width: targetRef.current.offsetWidth,
      height: targetRef.current.offsetHeight,
    });

    const handleResize = () => {
      if (!targetRef.current) return;
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [!!targetRef.current, ...dependencies]);

  return dimensions;
};
