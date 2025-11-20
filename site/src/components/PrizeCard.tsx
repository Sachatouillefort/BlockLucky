import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PrizeCardProps {
  rank: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
}

export function PrizeCard({ rank, icon, title, description, color = "from-primary to-primary/50" }: PrizeCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all">
      <Badge className={`mb-4 bg-gradient-to-r ${color} text-white border-0`}>
        {rank}
      </Badge>
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="font-['Orbitron'] font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
