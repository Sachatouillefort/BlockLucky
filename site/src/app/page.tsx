"use client";

import { Header } from "@/components/header";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLotteryContract } from "@/hooks/useLotteryContract";

export default function Home() {
  const { playersCount } = useLotteryContract();

  const features = [
    {
      icon: "🔒",
      title: "Vos transactions sont publiques et sécurisées",
      description: "Chaque ticket est enregistré sur la blockchain Ethereum"
    },
    {
      icon: "💡",
      title: "Aucune donnée personnelle collectée",
      description: "Participez de manière anonyme avec votre wallet"
    },
    {
      icon: "🎁",
      title: "Un tirage 100% automatisé",
      description: "Le smart contract effectue le tirage de manière transparente"
    }
  ];

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
          {/* Badge */}
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 px-4 py-2 text-sm animate-float">
            La grande loterie d'EtherBay 🎆
          </Badge>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-['Orbitron'] font-bold text-center mb-6 neon-text">
            BlockLucky
          </h1>

          {/* Slogan */}
          <p className="text-xl md:text-2xl text-center text-muted-foreground mb-8 max-w-2xl">
            Jouez en toute transparence grâce à la blockchain !
          </p>

          {/* CTA Principal */}
          <Link href="/participer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6 rounded-xl animate-glow mb-12"
            >
              Participer à la loterie
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>

          {/* Compteur de participants */}
          <Card className="neon-border bg-card/50 backdrop-blur-sm p-6 mb-12">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Participants en temps réel</p>
              <p className="text-4xl font-['Orbitron'] font-bold text-primary">
                {playersCount || 0}
              </p>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card/30 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-['Orbitron'] font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section info */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold mb-6">
              Une loterie nouvelle génération
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              BlockLucky combine le frisson du jeu avec la transparence de la blockchain.
              Découvrez une expérience de loterie où chaque transaction est vérifiable,
              chaque tirage est équitable, et chaque participant peut vérifier les résultats.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/comment-ca-marche">
                <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                  Comment ça marche ?
                </Button>
              </Link>
              <Link href="/decouvrir">
                <Button variant="outline" size="lg" className="border-secondary/50 hover:bg-secondary/10">
                  Découvrir la blockchain
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
