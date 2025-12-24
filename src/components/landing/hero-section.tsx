import Link from 'next/link';
import { ClaimIdForm } from './claim-id-form';

export function HeroSection() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl p-8 shadow-2xl bg-card/95 backdrop-blur-2xl border border-border">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            <span className="gradient-text">Claim Your ID</span>
          </h1>
          <ClaimIdForm />

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              href="/profiles"
              className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all w-full justify-center"
            >
              See other profiles
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
