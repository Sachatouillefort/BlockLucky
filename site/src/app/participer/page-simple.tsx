"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Participer() {
  const { address, isConnected } = useAccount();

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

          <div className="max-w-2xl mx-auto">
            <Card className="neon-border bg-card/50 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-['Orbitron'] font-bold mb-6">
                Test de connexion
              </h2>

              <div className="space-y-6">
                <div className="text-center">
                  {isConnected ? (
                    <div className="space-y-4">
                      <p className="text-green-400">✅ Wallet connecté !</p>
                      <p className="font-mono text-sm">{address}</p>
                      <Button variant="outline">
                        Acheter un ticket (bientôt disponible)
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Connectez votre wallet pour continuer
                      </p>
                      <ConnectButton />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
