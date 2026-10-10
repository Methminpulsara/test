import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch and book your appointment with Aurelle Studio.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bone pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-16 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-mulberry mb-6">Contact Us</h1>
          <p className="font-body text-ink-soft text-lg max-w-2xl mx-auto">
            We look forward to welcoming you. Reach out to schedule an appointment or consultation.
          </p>
        </header>
        
        <ContactClient />
      </div>
    </div>
  );
}
