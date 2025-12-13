import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import type { IconBaseProps } from 'react-icons';
import { FaArrowUp } from 'react-icons/fa';
import './top-button.css';

function TopButton() {
  const [visible, setVisible] = useState(false);
  const UpIcon = FaArrowUp as ComponentType<IconBaseProps>;

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="nf-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Go to top"
    >
      <UpIcon aria-hidden="true" /> Top
    </button>
  );
}

export default TopButton;
