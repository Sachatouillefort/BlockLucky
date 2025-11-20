"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useDailyLotteryContract } from "@/hooks/useDailyLotteryContract";

export default function Participer() {
  const { address, isConnected } = useAccount();

  // Utiliser le hook du contrat quotidien
  const {
    ticketPrice,
    playersCount,
    maxPlayers,
    lotteryActive,
    currentPrize,
    currentDay,
    buyTicket,
    isBuyingTicket,
    isConfirmed,
    buyTicketError,
    lastTxHash
  } = useDailyLotteryContract();

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
              Jour {currentDay + 1} / 3
            </Badge>
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Participer à la loterie
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connectez votre wallet et achetez vos tickets pour gagner le prix du jour
            </p>
          </div>

          {/* Prix du jour */}
          {currentPrize && (
            <Card className="neon-border bg-gradient-to-br from-primary/10 to-secondary/10 p-8 mb-12 max-w-3xl mx-auto">
              <div className="text-center">
                <Badge className={`mb-4 bg-gradient-to-r ${currentPrize.color} text-white px-4 py-2`}>
                  Prix du Jour {currentDay + 1}
                </Badge>
                <div className="text-6xl mb-4 animate-bounce">{currentPrize.icon}</div>
                <h3 className="text-3xl font-['Orbitron'] font-bold mb-3">
                  {currentPrize.name}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {currentPrize.description}
                </p>
              </div>
            </Card>
          )}

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
                      Les 3 jours de loterie sont terminés ou la loterie n'a pas encore commencé
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
                        <span className="font-mono font-bold">{ticketPrice} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-mono">
                          {playersCount} / {maxPlayers}
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'achat */}
                    <Button
                      onClick={buyTicket}
                      disabled={isBuyingTicket || !lotteryActive}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-6"
                    >
                      {isBuyingTicket ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Transaction en cours...
                        </>
                      ) : (
                        <>
                          Acheter un ticket ({ticketPrice} ETH)
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

                    {/* Message d'erreur */}
                    {buyTicketError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-red-500">
                          ❌ Erreur: {(buyTicketError as Error).message}
                        </p>
                      </div>
                    )}

                    {/* Message de succès */}
                    {isConfirmed && lastTxHash && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">✅</span>
                          <p className="font-bold text-green-500">Ticket acheté avec succès !</p>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono break-all">
                          Hash: {lastTxHash}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Vous participez maintenant au tirage du jour {currentDay + 1}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Statistiques */}
            <div className="space-y-6">
              <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-6">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-4">
                  Statistiques du jour {currentDay + 1}
                </h3>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Participants</div>
                    <div className="text-3xl font-['Orbitron'] font-bold text-primary">
                      {playersCount}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Places restantes</div>
                    <div className="text-3xl font-['Orbitron'] font-bold text-secondary">
                      {maxPlayers - playersCount}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Cagnotte actuelle</div>
                    <div className="text-2xl font-['Orbitron'] font-bold">
                      {(playersCount * Number(ticketPrice)).toFixed(4)} ETH
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ≈ ${(playersCount * Number(ticketPrice) * 3200).toLocaleString()} USD
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-6">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-4">
                  Comment ça marche ?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Connectez votre wallet</h4>
                      <p className="text-sm text-muted-foreground">
                        Utilisez MetaMask ou un autre wallet compatible
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Achetez un ticket</h4>
                      <p className="text-sm text-muted-foreground">
                        Chaque ticket coûte {ticketPrice} ETH
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Attendez le tirage</h4>
                      <p className="text-sm text-muted-foreground">
                        Le tirage a lieu automatiquement à la fin du jour
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Gagnez le prix !</h4>
                      <p className="text-sm text-muted-foreground">
                        Si vous gagnez, nous vous contactons pour vous remettre votre prix
                      </p>
                    </div>
                  </div>
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
