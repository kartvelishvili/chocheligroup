
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Trigger page reveal animation
    const root = document.getElementById('root');
    if (root) {
      root.animate(
        [
          { opacity: 0, transform: 'translateY(-10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 400,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
