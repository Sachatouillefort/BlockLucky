import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <Card
      className="bg-card/30 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all hover:scale-105"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-['Orbitron'] font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
