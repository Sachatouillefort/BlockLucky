"use client";

import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Générer des bulles aléatoires
    const newBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 150 + 50, // 50-200px
      left: Math.random() * 100, // 0-100%
      top: Math.random() * 100, // 0-100%
      delay: Math.random() * 5, // 0-5s
      duration: Math.random() * 4 + 4, // 4-8s
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

      {/* Bulles flottantes */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}

      {/* Lumières néon */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-neon" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-neon" style={{ animationDelay: "1s" }} />
    </div>
  );
}
