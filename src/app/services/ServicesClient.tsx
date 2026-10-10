'use client';

import { useState } from 'react';
import Image from 'next/image';
import { services, contact } from '@/content/site';
import { waLink } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';
import ArchMask from '@/components/ui/ArchMask';

export default function ServicesClient() {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'hair', 'bridal', 'skin', 'nails'];

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category.toLowerCase() === filter);

  return (
    <div className="container mx-auto px-4 md:px-8">
      <header className="mb-16 text-center">
        <h1 className="font-display text-5xl md:text-7xl text-mulberry mb-6">Our Services</h1>
        <p className="font-body text-ink-soft text-lg max-w-2xl mx-auto mb-12">
          Experience the art of refinement with our curated selection of bespoke salon services.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-body text-sm tracking-wide uppercase transition-colors duration-300 ${
                filter === cat 
                  ? 'bg-mulberry text-bone' 
                  : 'border border-mulberry/20 text-mulberry hover:bg-mulberry/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
        {filteredServices.map((service, idx) => {
          const prefilledMessage = `Hi Aurelle Studio, I would like to book an appointment for ${service.name}.`;
          
          return (
            <article key={idx} className="flex flex-col group">
              <div className="mb-6 relative w-full aspect-[4/5] overflow-hidden rounded-xl">
                {service.image ? (
                  <ArchMask>
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectPosition: service.focus ?? '50% 50%' }}
                    />
                  </ArchMask>
                ) : (
                  <div className="w-full h-full bg-cream rounded-xl" />
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-bone/90 backdrop-blur-sm text-mulberry text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-2xl text-ink">{service.name}</h3>
                <span className="font-body text-rose font-medium">{service.price}</span>
              </div>
              
              <p className="font-body text-ink-soft text-sm leading-relaxed mb-8 flex-grow">
                {service.description}
              </p>
              
              <div className="mt-auto">
                <MagneticButton>
                  <a
                    href={waLink(contact.whatsapp, prefilledMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-3 border border-mulberry text-mulberry font-body uppercase tracking-widest text-sm hover:bg-mulberry hover:text-bone transition-colors"
                  >
                    Book this Service
                  </a>
                </MagneticButton>
              </div>
            </article>
          );
        })}
      </div>

      <section className="bg-cream p-12 rounded-2xl text-center max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-mulberry mb-4">Not sure what you need?</h2>
        <p className="font-body text-ink-soft mb-8">
          Book a complimentary consultation with one of our expert stylists to discuss your vision.
        </p>
        <MagneticButton>
          <a
            href={waLink(contact.whatsapp, "Hi Aurelle Studio, I would like to book a consultation.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-mulberry text-bone px-8 py-4 font-body uppercase tracking-widest text-sm"
          >
            Book Consultation
          </a>
        </MagneticButton>
      </section>
    </div>
  );
}
