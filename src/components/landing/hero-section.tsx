import { ClaimIdForm } from './claim-id-form';
import { Card } from '@/components/ui/card';

export function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 pt-12 pb-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="gradient-text">Claim Your ID</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Create your personal profile website in minutes. Show the world who you are.
          </p>
        </div>

        <Card className="max-w-md mx-auto p-8">
          <ClaimIdForm />
        </Card>
      </div>
    </section>
  );
}
