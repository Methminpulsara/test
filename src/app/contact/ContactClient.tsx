'use client';

import { useState } from 'react';
import { contact, services } from '@/content/site';
import { waLink, telLink, mailtoLink } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct pre-formatted message
    const message = `Hello Aurelle Studio,
I would like to request an appointment.

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${formData.service}
*Preferred Date:* ${formData.date}
*Notes:* ${formData.notes || 'None'}`;

    // Redirect to WhatsApp
    window.open(waLink(contact.whatsapp, message), '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
      {/* Contact Info */}
      <div className="space-y-12">
        <div>
          <h2 className="font-display text-3xl text-mulberry mb-6">Visit the Studio</h2>
          <p className="font-body text-ink-soft leading-relaxed whitespace-pre-line mb-6">
            {contact.address}
          </p>
          <MagneticButton>
            <a 
              href={contact.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-rose font-bold uppercase tracking-widest text-sm border-b border-rose pb-1 hover:text-mulberry hover:border-mulberry transition-colors"
            >
              Get Directions
            </a>
          </MagneticButton>
        </div>

        <div>
          <h2 className="font-display text-3xl text-mulberry mb-6">Opening Hours</h2>
          <p className="font-body text-ink-soft whitespace-pre-line leading-relaxed">
            {contact.hours}
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl text-mulberry mb-6">Direct Connect</h2>
          <div className="flex flex-col gap-4 items-start">
            <MagneticButton>
              <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="font-body text-ink hover:text-mulberry flex items-center gap-3">
                <span className="bg-cream p-3 rounded-full text-mulberry font-bold text-sm">WA</span>
                {contact.whatsapp}
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href={telLink(contact.phone)} className="font-body text-ink hover:text-mulberry flex items-center gap-3">
                <span className="bg-cream p-3 rounded-full text-mulberry font-bold text-sm">PH</span>
                {contact.phone}
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href={mailtoLink(contact.email)} className="font-body text-ink hover:text-mulberry flex items-center gap-3">
                <span className="bg-cream p-3 rounded-full text-mulberry font-bold text-sm">EM</span>
                {contact.email}
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Appointment Form */}
      <div className="bg-cream p-8 md:p-12 rounded-2xl">
        <h2 className="font-display text-3xl text-mulberry mb-8">Request an Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-body text-sm text-ink-soft uppercase tracking-widest mb-2">Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-bone border border-mulberry/20 rounded-none px-4 py-3 font-body text-ink focus:outline-none focus:border-mulberry transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block font-body text-sm text-ink-soft uppercase tracking-widest mb-2">Phone / WhatsApp *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-bone border border-mulberry/20 rounded-none px-4 py-3 font-body text-ink focus:outline-none focus:border-mulberry transition-colors"
            />
          </div>

          <div>
            <label htmlFor="service" className="block font-body text-sm text-ink-soft uppercase tracking-widest mb-2">Service of Interest *</label>
            <select 
              id="service" 
              name="service" 
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full bg-bone border border-mulberry/20 rounded-none px-4 py-3 font-body text-ink focus:outline-none focus:border-mulberry transition-colors appearance-none"
            >
              <option value="" disabled>Select a service...</option>
              {services.map((s, idx) => (
                <option key={idx} value={s.name}>{s.name}</option>
              ))}
              <option value="Consultation">General Consultation</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block font-body text-sm text-ink-soft uppercase tracking-widest mb-2">Preferred Date *</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-bone border border-mulberry/20 rounded-none px-4 py-3 font-body text-ink focus:outline-none focus:border-mulberry transition-colors"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block font-body text-sm text-ink-soft uppercase tracking-widest mb-2">Additional Notes</label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-bone border border-mulberry/20 rounded-none px-4 py-3 font-body text-ink focus:outline-none focus:border-mulberry transition-colors resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <MagneticButton>
              <button 
                type="submit"
                className="w-full bg-mulberry text-bone py-4 font-body uppercase tracking-widest text-sm hover:bg-ink transition-colors"
              >
                Send Request via WhatsApp
              </button>
            </MagneticButton>
            <p className="text-center font-body text-xs text-ink-soft mt-4">
              You will be redirected to WhatsApp to send this message directly to our studio.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
