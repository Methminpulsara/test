'use client';

import { useRef, type ReactNode, type ElementType } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  strength?: number;
  [key: string]: unknown;
}

export default function MagneticButton({
  children,
  as: Component = 'span', // span (not button) so wrapped <a>/<button> children stay valid HTML
  className = '',
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <Component
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="book"
      {...props}
    >
      {children}
    </Component>
  );
}
