import { ClaimIdForm } from './claim-id-form';
import { Card } from '@/components/ui/card';

export function HeroSection() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8 shadow-2xl bg-card">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            <span className="gradient-text">Claim Your ID</span>
          </h1>
          <ClaimIdForm />
        </Card>
      </div>
    </div>
  );
}
