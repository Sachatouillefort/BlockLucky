"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from "@/lib/lottery-abi";
import { formatEther } from "viem";

export default function Participer() {
  const { address, isConnected } = useAccount();

  // Lecture directe des données du contrat
  const { data: ticketPrice } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "ticketPrice",
  });

  const { data: playersCount } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "playersCount",
  });

  const { data: maxPlayers } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "maxPlayers",
  });

  const { data: lotteryActive } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: "lotteryActive",
  });

  // Écriture sur le contrat
  const {
    writeContract: buyTicket,
    data: txHash,
    isPending,
    error,
  } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleBuyTicket = () => {
    if (!ticketPrice) return;
    buyTicket({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: LOTTERY_ABI,
      functionName: "buyTicket",
      value: ticketPrice,
    });
  };

  const ticketPriceFormatted = ticketPrice ? formatEther(ticketPrice) : "0";
  const playersCountNum = playersCount ? Number(playersCount) : 0;
  const maxPlayersNum = maxPlayers ? Number(maxPlayers) : 0;

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Participer à la loterie
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connectez votre wallet et achetez vos tickets
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Formulaire d'achat */}
            <div>
              <Card className="neon-border bg-card/50 backdrop-blur-sm p-8">
                <h2 className="text-2xl font-['Orbitron'] font-bold mb-6">
                  Acheter un ticket
                </h2>

                {!isConnected ? (
                  <div className="space-y-6">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center">
                      <div className="text-5xl mb-4">🦊</div>
                      <h3 className="font-bold text-lg mb-2">Connexion requise</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connectez votre wallet pour participer
                      </p>
                      <div className="flex justify-center">
                        <ConnectButton />
                      </div>
                    </div>
                  </div>
                ) : !lotteryActive ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="font-bold text-lg mb-2">Loterie inactive</h3>
                    <p className="text-sm text-muted-foreground">
                      La loterie n'est pas active pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Wallet connecté */}
                    <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                          <span className="text-xl">✓</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Wallet connecté</p>
                          <p className="font-mono text-sm">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </p>
                        </div>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/50">
                          Connecté
                        </Badge>
                      </div>
                    </div>

                    {/* Info du ticket */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prix du ticket</span>
                        <span className="font-mono font-bold">{ticketPriceFormatted} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-mono">
                          {playersCountNum} / {maxPlayersNum}
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'achat */}
                    <Button
                      onClick={handleBuyTicket}
                      disabled={isPending || !lotteryActive}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-6"
                    >
                      {isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Transaction en cours...
                        </>
                      ) : (
                        <>
                          Acheter un ticket ({ticketPriceFormatted} ETH)
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </>
                      )}
                    </Button>

                    {/* Erreur */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-red-400">
                          ❌ Erreur: {error.message}
                        </p>
                      </div>
                    )}

                    {/* Confirmation */}
                    {isSuccess && txHash && (
                      <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 animate-float">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">✅</div>
                          <div className="flex-1">
                            <p className="font-bold mb-1">Transaction validée !</p>
                            <p className="text-sm text-muted-foreground break-all">
                              Hash: {txHash}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Statistiques */}
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-8">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-6">
                  Statistiques en temps réel
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Total participants
                      </span>
                      <span className="font-['Orbitron'] font-bold text-2xl text-primary">
                        {playersCountNum}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Places disponibles
                      </span>
                      <span className="font-['Orbitron'] font-bold text-2xl text-secondary">
                        {maxPlayersNum - playersCountNum}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cagnotte */}
              <Card className="neon-border bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <div className="text-center">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="text-lg font-['Orbitron'] font-bold mb-2">
                    Cagnotte actuelle
                  </h3>
                  <div className="text-4xl font-['Orbitron'] font-bold text-primary mb-2">
                    {(playersCountNum * Number(ticketPriceFormatted)).toFixed(4)} ETH
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(playersCountNum * Number(ticketPriceFormatted) * 3200).toLocaleString()} USD
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
