import { Metadata } from 'next';
import Image from 'next/image';
import { galleryItems, contact } from '@/content/site';
import { waLink } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A visual portfolio of looks crafted at Aurelle Studio.',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-bone pt-36 pb-24" data-theme="light">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-16 text-center">
          <h1 className="font-display text-mulberry mb-6 leading-[0.9]" style={{ fontSize: 'clamp(4rem, 14vw, 13rem)', letterSpacing: '-0.04em' }}>Gal<span className="italic text-rose">lery</span></h1>
          <p className="font-body text-ink-soft text-lg max-w-2xl mx-auto">
            A look at the colour, texture and finish we love to create.
          </p>
        </header>

        {/* Masonry-like Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx} 
              className="break-inside-avoid group relative overflow-hidden rounded-xl"
              data-cursor="view"
            >
              <div 
                className={`relative w-full ${
                  item.aspect === 'portrait' ? 'aspect-[3/4]' : 
                  item.aspect === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt || item.caption || "Gallery look"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectPosition: item.focus ?? '50% 50%' }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-mulberry/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    {item.caption && (
                      <p className="text-bone font-body text-sm font-medium">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 text-center">
          <h2 className="font-display text-4xl text-mulberry mb-6">Inspired?</h2>
          <p className="font-body text-ink-soft mb-8">
            Let&apos;s create something beautiful together.
          </p>
          <MagneticButton>
            <a
              href={waLink(contact.whatsapp, "Hi Aurelle Studio, I'm inspired by your gallery and would like to book a consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-mulberry text-bone px-8 py-4 font-body uppercase tracking-widest text-sm hover:bg-ink transition-colors"
            >
              Book a Consultation
            </a>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
