import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore our range of premium hair, bridal, skin, and nail services.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-bone pt-32 pb-16">
      <ServicesClient />
    </div>
  );
}
