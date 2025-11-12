"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from "@/lib/lottery-abi";
import { formatEther } from "viem";

export default function Tirage() {
  const { address, isConnected } = useAccount();
  
  // Lecture des données du contrat
  const { data: deadline } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "deadline",
  });

  const { data: lotteryActive } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "lotteryActive",
  });

  const { data: players } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "getPlayers",
  });

  const { data: lastWinner } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "lastWinner",
  });

  const { data: lastPrize } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "lastPrize",
  });

  const { data: ownerAddress } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "owner",
  });

  // Fonction pour lancer le tirage (seulement le owner)
  const { writeContract: pickWinner, data: pickWinnerHash } = useWriteContract();

  const { isLoading: isPickingWinner, isSuccess: winnerPicked } = useWaitForTransactionReceipt({
    hash: pickWinnerHash,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rollingNumbers, setRollingNumbers] = useState<number[]>([]);

  // Calculer le compte à rebours basé sur la deadline du contrat
  useEffect(() => {
    if (!deadline) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const deadlineNum = Number(deadline);
      const diff = deadlineNum - now;

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

  // Vérifier si l'utilisateur est le owner
  const isOwner = address && ownerAddress && address.toLowerCase() === ownerAddress.toLowerCase();

  // Fonction pour lancer le tirage avec animation
  const startDraw = () => {
    if (!isOwner) return;

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
      
      // Appeler la fonction pickWinner du contrat
      pickWinner({
        address: LOTTERY_CONTRACT_ADDRESS,
        abi: LOTTERY_ABI,
        functionName: "pickWinner",
      });
    }, 3000);
  };

  // Afficher les confettis quand un gagnant est désigné
  useEffect(() => {
    if (winnerPicked) {
      setShowConfetti(true);
      setIsDrawing(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [winnerPicked]);

  // Vérifier si le temps est écoulé
  const isTimeUp = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  
  // Déterminer s'il y a un gagnant récent
  const hasWinner = lastWinner && lastWinner !== "0x0000000000000000000000000000000000000000";

  return (
    <>
      <AnimatedBackground />
      <Header />

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
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Tirage au sort
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {hasWinner ? "Le gagnant a été désigné !" : "Le tirage approche..."}
            </p>
          </div>

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
                    disabled={isDrawing || !isOwner || !isConnected || !isTimeUp || !lotteryActive}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6"
                  >
                    {isDrawing ? "Tirage en cours..." : 
                     !isConnected ? "Connectez votre wallet" :
                     !isOwner ? "Réservé au propriétaire" :
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
                  Participants
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
                  <div className="text-8xl mb-6 animate-float">🎉</div>

                  <h2 className="text-3xl font-['Orbitron'] font-bold mb-4">
                    Félicitations au gagnant !
                  </h2>

                  <div className="bg-background/50 rounded-xl p-8 max-w-md mx-auto mb-8">
                    <div className="text-sm text-muted-foreground mb-2">Adresse gagnante</div>
                    <div className="text-2xl font-['Orbitron'] font-bold text-primary break-all">
                      {lastWinner}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Gain</div>
                      <div className="text-2xl font-['Orbitron'] font-bold text-secondary">
                        {lastPrize ? formatEther(lastPrize) : "0"} ETH
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Participants</div>
                      <div className="text-2xl font-['Orbitron'] font-bold">
                        {players ? players.length : 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
                    <p className="text-sm font-medium mb-2">
                      Le tirage vient d'être effectué automatiquement par le smart contract
                    </p>
                    <code className="text-xs font-mono text-secondary break-all">
                      #0xA31B7E2F5C893D4E2A1C0B8D9E3F6A1B2C3D4E5F...
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      sur la blockchain Ethereum
                    </p>
                  </div>
                </div>
              </Card>

              {/* Vérification */}
              <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-8">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-6">
                  Vérifier le résultat
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Transaction de tirage</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Le tirage a été effectué dans le bloc #18,523,891
                      </p>
                      <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        Voir sur Etherscan
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Code du smart contract</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Le code source est vérifié et open-source
                      </p>
                      <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        Voir le code
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Liste des participants</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Tous les tickets enregistrés sont visibles publiquement
                      </p>
                      <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        Voir tous les tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Prochain tirage */}
              <div className="text-center">
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 inline-block">
                  <h3 className="text-xl font-['Orbitron'] font-bold mb-3">
                    Prochain tirage
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Le prochain tirage aura lieu dans 7 jours
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Participer au prochain tirage
                  </Button>
                </Card>
              </div>
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
