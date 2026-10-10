import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-9xl md:text-[12rem] text-mulberry leading-none mb-4">
        404
      </h1>
      <h2 className="font-display text-3xl md:text-5xl text-ink mb-8">
        This look hasn&apos;t been styled yet.
      </h2>
      <p className="font-body text-ink-soft mb-12 max-w-md mx-auto">
        The page you are looking for does not exist or has been moved. Let us guide you back to our studio.
      </p>
      
      <MagneticButton>
        <Link 
          href="/"
          className="inline-block bg-mulberry text-bone px-8 py-4 font-body uppercase tracking-widest text-sm hover:bg-ink transition-colors"
        >
          Return Home
        </Link>
      </MagneticButton>
    </div>
  );
}
