import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DayCardProps {
  day: number;
  title: string;
  description: string;
  icon: string;
  association: string;
  drawTime: string;
}

export function DayCard({ day, title, description, icon, association, drawTime }: DayCardProps) {
  return (
    <Card className="neon-border bg-card/50 backdrop-blur-sm p-6">
      <Badge className={`mb-4 ${day === 2 ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
        Jour {day}
      </Badge>
      <h3 className="text-xl font-['Orbitron'] font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-bold text-secondary">Association : {association}</p>
      <p className="text-xs text-muted-foreground mt-2">{drawTime}</p>
    </Card>
  );
}
