import { HeroSection } from '@/components/landing/hero-section';
import { ProfileMarqueeBackground } from '@/components/landing/profile-marquee-background';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Marquee */}
      <ProfileMarqueeBackground />

      {/* Centered Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <HeroSection />
      </div>
    </main>
  );
}
