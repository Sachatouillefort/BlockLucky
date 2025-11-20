"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { WinnerFormModal } from "@/components/WinnerFormModal";
import { useDailyLotteryContract } from "@/hooks/useDailyLotteryContract";
import { DAILY_PRIZES } from "@/lib/daily-lottery-abi";
import { DailyPrizeCard } from "@/components/DailyPrizeCard";

export default function Tirage() {
  const { address, isConnected } = useAccount();
  
  // Utiliser le hook pour le contrat quotidien
  const {
    deadline,
    lotteryActive,
    players,
    lastWinner,
    lastPrizeDay,
    currentDay,
    currentPrize,
    winners,
    pickWinner,
    isPickingWinner,
    allPrizes
  } = useDailyLotteryContract();

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Calculer le compte à rebours basé sur la deadline du contrat
  useEffect(() => {
    if (!deadline) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  // Fonction pour lancer le tirage avec animation
  const startDraw = () => {
    setIsDrawing(true);

    // Animation de défilement des numéros
    const rollInterval = setInterval(() => {
      setRollingNumbers(Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10000) + 1000
      ));
    }, 100);

    // Appeler le contrat après l'animation
    setTimeout(() => {
      clearInterval(rollInterval);
      setRollingNumbers([]);
      pickWinner();
    }, 3000);
  };

  // Afficher les confettis quand un gagnant est désigné
  useEffect(() => {
    if (lastWinner && lastWinner !== "0x0000000000000000000000000000000000000000") {
      setShowConfetti(true);
      setIsDrawing(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [lastWinner]);

  // Vérifier si le temps est écoulé
  const isTimeUp = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  
  // Déterminer s'il y a un gagnant récent
  const hasWinner = lastWinner && lastWinner !== "0x0000000000000000000000000000000000000000";
  
  // Vérifier si l'utilisateur connecté est le gagnant
  const isWinner = address && lastWinner && address.toLowerCase() === lastWinner.toLowerCase();

  // Obtenir les informations du prix gagné
  const wonPrize = lastPrizeDay > 0 ? DAILY_PRIZES[lastPrizeDay - 1] : null;

  // Afficher le modal automatiquement si l'utilisateur est le gagnant
  useEffect(() => {
    if (isWinner && hasWinner && !hasShownModal && isConnected) {
      setShowWinnerModal(true);
      setHasShownModal(true);
    }
  }, [isWinner, hasWinner, hasShownModal, isConnected]);

  return (
    <>
      <AnimatedBackground />
      <Header />

      {/* Modal pour le gagnant */}
      {isWinner && wonPrize && address && (
        <WinnerFormModal
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          prize={wonPrize.name}
          walletAddress={address}
        />
      )}

      {/* Confettis */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                background: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          {/* Titre */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
              Jour {currentDay + 1} / 3
            </Badge>
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Tirage au sort quotidien
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {hasWinner ? `Le gagnant du jour ${lastPrizeDay} a été désigné !` : "Le prochain tirage approche..."}
            </p>
          </div>

          {/* Prix du jour actuel */}
          {!hasWinner && currentPrize && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="neon-border bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-['Orbitron'] font-bold mb-4">
                    🎁 Prix du jour
                  </h2>
                  <div className="text-6xl mb-4">{currentPrize.icon}</div>
                  <h3 className="text-3xl font-['Orbitron'] font-bold mb-3">
                    {currentPrize.name}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {currentPrize.description}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {!hasWinner ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Compte à rebours */}
              <Card className="neon-border bg-card/50 backdrop-blur-sm p-12">
                <div className="text-center">
                  <h2 className="text-2xl font-['Orbitron'] font-bold mb-8">
                    Tirage dans
                  </h2>

                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6">
                      <div className="text-5xl font-['Orbitron'] font-bold text-primary mb-2">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-muted-foreground">Heures</div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6">
                      <div className="text-5xl font-['Orbitron'] font-bold text-primary mb-2">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6">
                      <div className="text-5xl font-['Orbitron'] font-bold text-primary mb-2">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-sm text-muted-foreground">Secondes</div>
                    </div>
                  </div>

                  <Button
                    onClick={startDraw}
                    disabled={isDrawing || !isConnected || !isTimeUp || !lotteryActive || isPickingWinner}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6"
                  >
                    {isDrawing || isPickingWinner ? "Tirage en cours..." : 
                     !isConnected ? "Connectez votre wallet" :
                     !isTimeUp ? "Attendez la fin du temps" :
                     !lotteryActive ? "Loterie inactive" :
                     "Lancer le tirage"}
                  </Button>
                </div>
              </Card>

              {/* Animation de tirage */}
              {isDrawing && (
                <Card className="neon-border bg-card/50 backdrop-blur-sm p-12 animate-glow">
                  <h3 className="text-2xl font-['Orbitron'] font-bold text-center mb-8">
                    Sélection en cours...
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-hidden">
                    {rollingNumbers.map((num, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg p-4 text-center transform transition-all"
                        style={{
                          animation: 'slideIn 0.3s ease-out',
                          opacity: 1 - (index * 0.1)
                        }}
                      >
                        <span className="text-2xl font-['Orbitron'] font-bold">
                          Ticket #{num}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Liste des participants */}
              <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-8">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-6">
                  Participants ({players?.length || 0})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {players && players.length > 0 ? (
                    players.slice(0, 12).map((player, i) => (
                      <div
                        key={i}
                        className="bg-muted/30 rounded-lg p-3 text-center text-sm font-mono"
                      >
                        {player.slice(0, 6)}...{player.slice(-4)}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground">
                      Aucun participant pour le moment
                    </div>
                  )}
                </div>
                {players && players.length > 12 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Et {players.length - 12} autres participants...
                  </p>
                )}
              </Card>
            </div>
          ) : (
            // Résultat du tirage
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="neon-border bg-gradient-to-br from-primary/20 to-secondary/20 p-12">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-float">{wonPrize?.icon || "🎉"}</div>

                  <h2 className="text-3xl font-['Orbitron'] font-bold mb-4">
                    Félicitations au gagnant !
                  </h2>

                  <Badge className={`mb-6 bg-gradient-to-r ${wonPrize?.color || 'from-primary to-secondary'} text-white px-4 py-2 text-lg`}>
                    Jour {lastPrizeDay}
                  </Badge>

                  <div className="bg-background/50 rounded-xl p-8 max-w-md mx-auto mb-8">
                    <div className="text-sm text-muted-foreground mb-2">Adresse gagnante</div>
                    <div className="text-2xl font-['Orbitron'] font-bold text-primary break-all">
                      {lastWinner}
                    </div>
                    {isWinner && (
                      <div className="mt-4">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          C'est vous ! 🎉
                        </Badge>
                        <Button
                          onClick={() => setShowWinnerModal(true)}
                          className="w-full mt-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          size="sm"
                        >
                          Remplir mes informations
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-['Orbitron'] font-bold mb-3">
                      {wonPrize?.name}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {wonPrize?.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Historique des gagnants */}
              {winners && winners.length > 0 && (
                <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-8">
                  <h3 className="text-xl font-['Orbitron'] font-bold mb-6">
                    Historique des gagnants
                  </h3>

                  <div className="space-y-4">
                    {winners.map((winner: any, index: number) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                        <div className="text-4xl">{winner.prizeIcon}</div>
                        <div className="flex-1">
                          <div className="font-bold">Jour {winner.prizeDay}</div>
                          <div className="text-sm text-muted-foreground">{winner.prizeName}</div>
                        </div>
                        <div className="text-sm font-mono text-primary">
                          {winner.address.slice(0, 6)}...{winner.address.slice(-4)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Les 3 prix */}
              <div className="space-y-6">
                <h3 className="text-2xl font-['Orbitron'] font-bold text-center">
                  Tous les prix de la semaine
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {allPrizes.map((prize, index) => {
                    const dayIndex = index;
                    const isToday = dayIndex === currentDay;
                    const isWon = dayIndex < currentDay;
                    const winner = winners.find((w: any) => w.prizeDay === prize.day);
                    
                    return (
                      <DailyPrizeCard
                        key={prize.day}
                        day={prize.day}
                        name={prize.name}
                        description={prize.description}
                        icon={prize.icon}
                        color={prize.color}
                        isWon={isWon}
                        isToday={isToday}
                        winnerAddress={winner?.address}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Prochain tirage */}
              {currentDay < 2 && (
                <div className="text-center">
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 inline-block">
                    <h3 className="text-xl font-['Orbitron'] font-bold mb-3">
                      Prochain tirage
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Jour {currentDay + 2} - Demain à la même heure
                    </p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Participer au prochain tirage
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
