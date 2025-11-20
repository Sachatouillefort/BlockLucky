"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Subgoal {
  amount: number;
  description: string;
  completed: boolean;
}

interface StreamerCardProps {
  name: string;
  avatar: string;
  isLive: boolean;
  amountCollected: number;
  goal: number;
  platform: string;
  viewers?: number;
  subgoals?: Subgoal[];
}

export function StreamerCard({
  name,
  avatar,
  isLive,
  amountCollected,
  goal,
  platform,
  viewers,
  subgoals = []
}: StreamerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = (amountCollected / goal) * 100;

  return (
    <div>
      <Card
        className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer"
        onClick={() => subgoals.length > 0 && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold overflow-hidden">
              {avatar}
            </div>
            {isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            )}
          </div>

          {/* Infos */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-['Orbitron'] font-bold text-lg">{name}</h3>
                <p className="text-xs text-muted-foreground">{platform}</p>
              </div>
              <div className="flex items-center gap-2">
                {isLive ? (
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/50">
                    🔴 LIVE {viewers && `• ${viewers}`}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-muted-foreground/50 text-muted-foreground">
                    Hors ligne
                  </Badge>
                )}
                {subgoals.length > 0 && (
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>

            {/* Progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collecté</span>
                <span className="font-bold text-secondary">{amountCollected.toFixed(2)} ETH</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.toFixed(0)}% de l'objectif</span>
                <span>Objectif : {goal} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subgoals expanded */}
      {isExpanded && subgoals.length > 0 && (
        <Card className="mt-4 bg-card/30 backdrop-blur-sm border-primary/20 p-6 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-['Orbitron'] font-bold text-lg">Subgoals de {name}</h4>
            <Badge className="bg-primary/20 text-primary">
              {subgoals.filter(s => s.completed).length} / {subgoals.length}
            </Badge>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {subgoals.map((subgoal, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                  subgoal.completed
                    ? 'border-secondary bg-secondary/10'
                    : amountCollected >= subgoal.amount
                    ? 'border-secondary bg-secondary/10 animate-pulse'
                    : 'border-primary/30 bg-card/50'
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                  {subgoal.completed || amountCollected >= subgoal.amount ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-['Orbitron'] font-bold text-primary">
                      {subgoal.amount.toFixed(2)} ETH
                    </span>
                    {amountCollected >= subgoal.amount && !subgoal.completed && (
                      <Badge className="bg-secondary text-white text-xs">DÉBLOQUÉ !</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{subgoal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
