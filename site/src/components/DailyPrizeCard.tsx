'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DailyPrizeCardProps {
  day: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isWon?: boolean;
  isToday?: boolean;
  winnerAddress?: string;
}

export function DailyPrizeCard({
  day,
  name,
  description,
  icon,
  color,
  isWon = false,
  isToday = false,
  winnerAddress,
}: DailyPrizeCardProps) {
  return (
    <Card className={`relative overflow-hidden p-6 transition-all hover:scale-105 ${
      isToday ? 'neon-border animate-glow' : 'border-primary/20'
    } ${isWon ? 'opacity-60' : ''}`}>
      {/* Badge pour le jour actuel */}
      {isToday && (
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white animate-pulse">
          Aujourd'hui
        </Badge>
      )}

      {/* Badge si déjà gagné */}
      {isWon && (
        <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-500 border-green-500/50">
          ✓ Gagné
        </Badge>
      )}

      {/* Icône */}
      <div className={`text-6xl mb-4 ${isToday ? 'animate-bounce' : ''}`}>
        {icon}
      </div>

      {/* Jour */}
      <div className="mb-3">
        <Badge className={`bg-gradient-to-r ${color} text-white`}>
          Jour {day}
        </Badge>
      </div>

      {/* Titre */}
      <h3 className="text-xl font-['Orbitron'] font-bold mb-3">
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>

      {/* Gagnant si déjà tiré */}
      {isWon && winnerAddress && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Gagnant</p>
          <p className="text-xs font-mono text-green-500 break-all">
            {winnerAddress.slice(0, 6)}...{winnerAddress.slice(-4)}
          </p>
        </div>
      )}

      {/* Statut */}
      <div className="mt-4 pt-4 border-t border-primary/20">
        <div className="flex items-center gap-2">
          {isToday ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-500">Tirage aujourd'hui</span>
            </>
          ) : isWon ? (
            <>
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-sm text-muted-foreground">Terminé</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-blue-500">À venir</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
