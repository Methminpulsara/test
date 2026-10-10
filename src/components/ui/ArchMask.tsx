import type { ReactNode } from 'react';

interface ArchMaskProps {
  children: ReactNode;
  className?: string;
}

/** Wraps content in an arch-shaped clip-path (oval/arch) */
export default function ArchMask({ children, className = '' }: ArchMaskProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        clipPath: 'inset(0 round 999px 999px 0 0)',
      }}
    >
      {children}
    </div>
  );
}
