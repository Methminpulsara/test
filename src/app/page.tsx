import Hero from '@/components/sections/Hero';
import PinnedStory from '@/components/sections/PinnedStory';
import HorizontalGallery from '@/components/sections/HorizontalGallery';
import ServicesList from '@/components/sections/ServicesList';
import KineticBand from '@/components/animation/KineticBand';
import TransformReveal from '@/components/sections/TransformReveal';
import SocialProof from '@/components/sections/SocialProof';
import LocationBooking from '@/components/sections/LocationBooking';

export default function HomePage() {
  return (
    <div className="relative w-full">
      <Hero />
      <PinnedStory />
      <HorizontalGallery />
      <ServicesList />
      <KineticBand />
      <TransformReveal />
      <SocialProof />
      <LocationBooking />
    </div>
  );
}
