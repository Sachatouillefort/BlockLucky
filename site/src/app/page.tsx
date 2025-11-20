"use client";

import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDailyLotteryContract } from "@/hooks/useDailyLotteryContract";
import { DailyPrizeCard } from "@/components/DailyPrizeCard";

export default function Home() {
  const { playersCount, currentDay, winners, allPrizes } = useDailyLotteryContract();

  const features = [
    {
      icon: "💚",
      title: "100% des dons reversés aux associations",
      description: "Chaque ETH est traçable jusqu'aux associations locales d'Etherbay"
    },
    {
      icon: "🎫",
      title: "Votre 1er don du jour = 1 ticket",
      description: "Gagnez des lots d'honneur symboliques : NFT, expériences VIP"
    },
    {
      icon: "🔍",
      title: "Transparence totale sur la blockchain",
      description: "Le tirage est public, aléatoire et vérifiable par tous"
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
            Marathon caritatif 3 jours 🎆
          </Badge>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-['Orbitron'] font-bold text-center mb-6 neon-text">
            BlockLucky Live
          </h1>

          {/* Sous-titre */}
          <p className="text-2xl md:text-3xl font-['Orbitron'] text-center text-secondary mb-4">
            Le Z Event d'Etherbay
          </p>

          {/* Slogan */}
          <p className="text-xl md:text-2xl text-center text-muted-foreground mb-8 max-w-2xl">
            À Etherbay, la générosité se joue à ciel ouvert
          </p>

          {/* CTA Principal */}
          <Link href="/participer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6 rounded-xl animate-glow mb-12"
            >
              Faire un don solidaire
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>

          {/* Compteur de participants */}
          <Card className="neon-border bg-card/50 backdrop-blur-sm p-6 mb-12">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Donateurs engagés</p>
              <p className="text-4xl font-['Orbitron'] font-bold text-primary">
                {playersCount || 0}
              </p>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </section>

        {/* Section Streamers */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold mb-6">
              Suivez vos streamers préférés
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              6 streamers mobilisés pour collecter des dons et soutenir Etherbay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-bold mb-1">TechWave</h3>
              <Badge className="bg-red-500/20 text-red-500 border-red-500/50 text-xs">🔴 LIVE</Badge>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 text-center">
              <div className="text-3xl mb-2">⛓️</div>
              <h3 className="font-bold mb-1">BlockchainBoss</h3>
              <Badge className="bg-red-500/20 text-red-500 border-red-500/50 text-xs">🔴 LIVE</Badge>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 text-center">
              <div className="text-3xl mb-2">👑</div>
              <h3 className="font-bold mb-1">CryptoQueen</h3>
              <Badge className="bg-red-500/20 text-red-500 border-red-500/50 text-xs">🔴 LIVE</Badge>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/decouvrir">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Voir tous les streamers
              </Button>
            </Link>
          </div>
        </section>

        {/* Section Prix à gagner - 3 Jours */}
        <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
              Un cadeau par jour 🎁
            </Badge>
            <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold mb-6">
              3 jours, 3 gagnants, 3 prix exceptionnels
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Chaque jour, un participant est tiré au sort pour remporter un prix unique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

          <div className="text-center mt-12">
            <Link href="/tirage">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6">
                Voir le tirage en direct
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </section>

        {/* Section marathon 3 jours */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Un système simple, transparent et équitable pour tous les participants
            </p>
          </div>

          {/* Les étapes */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-8 text-center">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-xl font-['Orbitron'] font-bold mb-3">Achetez un ticket</h3>
              <p className="text-muted-foreground">
                Participez pour seulement 0.01 ETH. Chaque ticket vous donne une chance de gagner le prix du jour.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-8 text-center">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-xl font-['Orbitron'] font-bold mb-3">Attendez le tirage</h3>
              <p className="text-muted-foreground">
                Chaque jour à minuit, un gagnant est tiré au sort de manière aléatoire et transparente sur la blockchain.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-8 text-center">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-xl font-['Orbitron'] font-bold mb-3">Réclamez votre prix</h3>
              <p className="text-muted-foreground">
                Si vous gagnez, nous vous contactons pour vous remettre votre prix exceptionnel !
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
