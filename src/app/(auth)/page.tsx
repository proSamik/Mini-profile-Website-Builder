import { HeroSection } from '@/components/landing/hero-section';
import { ProfileMarquee } from '@/components/landing/profile-marquee';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProfileMarquee />
    </main>
  );
}
