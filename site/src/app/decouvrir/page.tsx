"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { StreamerCard } from "@/components/StreamerCard";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Subgoal {
  amount: number;
  description: string;
  completed: boolean;
}

interface Streamer {
  id: string;
  name: string;
  avatar: string;
  platform: string;
  isLive: boolean;
  viewers?: number;
  amountCollected: number;
  goal: number;
  subgoals: Subgoal[];
}

export default function Streamers() {
  const [totalCollected, setTotalCollected] = useState(0);
  const [liveCount, setLiveCount] = useState(0);

  const streamers: Streamer[] = [
    {
      id: "1",
      name: "TechWave",
      avatar: "🎮",
      platform: "Twitch",
      isLive: true,
      viewers: 1247,
      amountCollected: 45.8,
      goal: 100,
      subgoals: [
        { amount: 5, description: "Je donne 1000€ à EtherKids", completed: true },
        { amount: 10, description: "24h de stream non-stop", completed: true },
        { amount: 20, description: "Je joue avec mes viewers toute la journée", completed: true },
        { amount: 30, description: "Je cuisine en direct pendant le stream", completed: true },
        { amount: 40, description: "Marathon gaming : tous les classiques en une session", completed: true },
        { amount: 50, description: "Je rase ma barbe en direct", completed: false },
        { amount: 60, description: "Collaboration avec 5 autres streamers du Z Event", completed: false },
        { amount: 75, description: "Je dors en stream jusqu'à la fin du Z Event", completed: false },
        { amount: 100, description: "J'organise un tournoi avec 10 000€ de cagnotte", completed: false }
      ]
    },
    {
      id: "2",
      name: "CryptoQueen",
      avatar: "👑",
      platform: "YouTube",
      isLive: true,
      viewers: 892,
      amountCollected: 38.2,
      goal: 80,
      subgoals: [
        { amount: 3, description: "Je donne 500€ à GreenBay", completed: true },
        { amount: 8, description: "Stream crypto-éducation pour débutants", completed: true },
        { amount: 15, description: "Je révèle mon portfolio crypto en live", completed: true },
        { amount: 25, description: "Masterclass blockchain avec invités surprise", completed: true },
        { amount: 35, description: "J'explique la blockchain à ma grand-mère en direct", completed: true },
        { amount: 50, description: "Je crée un NFT en direct et le donne au plus gros donateur", completed: false },
        { amount: 65, description: "Interview exclusive d'un expert Ethereum", completed: false },
        { amount: 80, description: "Je code un smart contract en live avec les viewers", completed: false }
      ]
    },
    {
      id: "3",
      name: "EtherbayHero",
      avatar: "🦸",
      platform: "Twitch",
      isLive: false,
      amountCollected: 52.1,
      goal: 120,
      subgoals: [
        { amount: 5, description: "Premier don de 1000€ à Art4All", completed: true },
        { amount: 12, description: "Je fais un tour de la ville d'Etherbay en costume", completed: true },
        { amount: 20, description: "Marathon IRL : visite des 3 associations", completed: true },
        { amount: 30, description: "Stream cosplay : je me déguise en super-héros local", completed: true },
        { amount: 45, description: "Défi sportif : 100 pompes toutes les heures", completed: true },
        { amount: 60, description: "Je distribue des goodies dans les rues d'Etherbay", completed: false },
        { amount: 80, description: "Concert surprise avec des artistes locaux", completed: false },
        { amount: 100, description: "Je saute en parachute avec le logo BlockLucky", completed: false },
        { amount: 120, description: "J'organise une flash mob géante à Etherbay", completed: false }
      ]
    },
    {
      id: "4",
      name: "GreenGamer",
      avatar: "🌿",
      platform: "Twitch",
      isLive: true,
      viewers: 643,
      amountCollected: 29.5,
      goal: 75,
      subgoals: [
        { amount: 3, description: "Je plante 100 arbres pour GreenBay", completed: true },
        { amount: 8, description: "Stream 100% énergie renouvelable", completed: true },
        { amount: 15, description: "Je joue uniquement à des jeux écolo pendant 12h", completed: true },
        { amount: 25, description: "Atelier recyclage en direct : je transforme des déchets", completed: true },
        { amount: 35, description: "Je mange vegan pendant tout le Z Event en stream", completed: false },
        { amount: 50, description: "Je nettoie le parc d'Etherbay en live", completed: false },
        { amount: 60, description: "Installation de panneaux solaires en direct", completed: false },
        { amount: 75, description: "Je deviens ambassadeur zéro déchet d'Etherbay", completed: false }
      ]
    },
    {
      id: "5",
      name: "ArtMaster",
      avatar: "🎨",
      platform: "YouTube",
      isLive: false,
      amountCollected: 41.3,
      goal: 90,
      subgoals: [
        { amount: 4, description: "Don de 800€ pour rénover la salle de concert", completed: true },
        { amount: 10, description: "Je peins un tableau géant en direct", completed: true },
        { amount: 18, description: "Atelier d'art collaboratif avec les viewers", completed: true },
        { amount: 28, description: "Je crée une œuvre avec seulement des dons matériels", completed: true },
        { amount: 40, description: "Performance artistique de 6h non-stop", completed: true },
        { amount: 55, description: "Je dessine les portraits de 50 donateurs", completed: false },
        { amount: 70, description: "Exposition virtuelle de toutes mes créations du Z Event", completed: false },
        { amount: 90, description: "Je peins la fresque officielle du BlockLucky Live", completed: false }
      ]
    },
    {
      id: "6",
      name: "BlockchainBoss",
      avatar: "⛓️",
      platform: "Twitch",
      isLive: true,
      viewers: 1523,
      amountCollected: 67.9,
      goal: 150,
      subgoals: [
        { amount: 5, description: "Premier don de 1000€", completed: true },
        { amount: 15, description: "Stream éducation blockchain 24h", completed: true },
        { amount: 25, description: "Je donne 5000€ aux associations", completed: true },
        { amount: 40, description: "Conférence avec les devs Ethereum", completed: true },
        { amount: 60, description: "Je code un dApp en direct", completed: true },
        { amount: 80, description: "Marathon : j'explique chaque ligne du smart contract BlockLucky", completed: false },
        { amount: 100, description: "Je ramène un expert blockchain internationale en surprise", completed: false },
        { amount: 125, description: "Défi ultime : je déploie un nouveau projet sur mainnet en live", completed: false },
        { amount: 150, description: "J'organise le premier BlockLucky Summit à Etherbay", completed: false }
      ]
    }
  ];

  useEffect(() => {
    const total = streamers.reduce((sum, s) => sum + s.amountCollected, 0);
    setTotalCollected(total);
    setLiveCount(streamers.filter(s => s.isLive).length);
  }, []);

  const globalGoal = streamers.reduce((sum, s) => sum + s.goal, 0);
  const globalProgress = (totalCollected / globalGoal) * 100;

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          {/* Titre */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Streamers en direct
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Suivez les streamers du BlockLucky Live en temps réel
            </p>
          </div>

          {/* Stats globales */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="neon-border bg-gradient-to-br from-primary/20 to-primary/10 p-6 text-center">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-sm text-muted-foreground mb-1">Total collecté</h3>
              <p className="text-3xl font-['Orbitron'] font-bold text-primary">
                {totalCollected.toFixed(2)} ETH
              </p>
            </Card>

            <Card className="neon-border bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 text-center">
              <div className="text-4xl mb-2">🔴</div>
              <h3 className="text-sm text-muted-foreground mb-1">Streamers en ligne</h3>
              <p className="text-3xl font-['Orbitron'] font-bold text-secondary">
                {liveCount} / {streamers.length}
              </p>
            </Card>

            <Card className="neon-border bg-gradient-to-br from-primary/20 to-secondary/10 p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-sm text-muted-foreground mb-1">Progression globale</h3>
              <p className="text-3xl font-['Orbitron'] font-bold">
                {globalProgress.toFixed(0)}%
              </p>
            </Card>
          </div>

          {/* Liste des streamers */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-['Orbitron'] font-bold">Tous les streamers</h2>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm text-muted-foreground">🔴 En direct</span>
                <span className="text-sm text-muted-foreground">• Hors ligne</span>
                <span className="text-sm text-primary font-medium">👆 Cliquez pour voir les subgoals</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {streamers
                .sort((a, b) => {
                  if (a.isLive && !b.isLive) return -1;
                  if (!a.isLive && b.isLive) return 1;
                  return b.amountCollected - a.amountCollected;
                })
                .map((streamer) => (
                  <StreamerCard
                    key={streamer.id}
                    name={streamer.name}
                    avatar={streamer.avatar}
                    platform={streamer.platform}
                    isLive={streamer.isLive}
                    viewers={streamer.viewers}
                    amountCollected={streamer.amountCollected}
                    goal={streamer.goal}
                    subgoals={streamer.subgoals}
                  />
                ))}
            </div>
          </div>

          {/* Légende */}
          <Card className="bg-card/30 backdrop-blur-sm border-primary/20 p-6 max-w-4xl mx-auto mt-12">
            <h3 className="font-['Orbitron'] font-bold mb-4">Comment ça marche ?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  Les streamers sont classés par statut (live en premier) puis par montant collecté
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  Le badge 🔴 LIVE indique qu'un streamer est actuellement en direct
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  <strong>Cliquez sur une carte</strong> pour découvrir les subgoals et défis du streamer
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  Les subgoals débloqués apparaissent en vert avec un badge "DÉBLOQUÉ !"
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  La barre de progression montre l'avancement vers l'objectif personnel
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <p className="text-muted-foreground">
                  Tous les dons sont tracés en temps réel sur la blockchain
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
