"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CommentCaMarche() {
  const steps = [
    {
      number: "01",
      title: "J'achète un ticket",
      description: "Connectez votre wallet et achetez vos tickets avec vos ethers. Chaque ticket vous donne une chance de gagner !",
      icon: "🎫",
      color: "from-primary to-primary/50"
    },
    {
      number: "02",
      title: "Mon ticket est enregistré",
      description: "Votre ticket est automatiquement enregistré sur la blockchain Ethereum. Cette opération est publique et vérifiable par tous.",
      icon: "⛓️",
      color: "from-secondary to-secondary/50"
    },
    {
      number: "03",
      title: "Le tirage est automatique",
      description: "Le smart contract effectue le tirage de manière aléatoire et transparente. Le résultat est immédiatement visible sur la blockchain.",
      icon: "🎰",
      color: "from-primary to-secondary"
    }
  ];

  const whyTransparent = [
    {
      question: "Qu'est-ce qu'un smart contract ?",
      answer: "Un smart contract est un programme informatique déployé sur la blockchain. Il s'exécute automatiquement selon des règles prédéfinies, sans intervention humaine possible."
    },
    {
      question: "Comment vérifier ma participation ?",
      answer: "Chaque transaction est enregistrée sur la blockchain avec un hash unique. Vous pouvez utiliser un explorateur de blocs comme Etherscan pour vérifier votre ticket."
    },
    {
      question: "Le tirage est-il vraiment équitable ?",
      answer: "Oui ! Le smart contract utilise une source d'aléatoire vérifiable (VRF). Le code est open-source et peut être audité par n'importe qui."
    }
  ];

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          {/* Titre */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Comment ça marche ?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez le fonctionnement de BlockLucky en 3 étapes simples
            </p>
          </div>

          {/* Étapes */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connecteur */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}

                <Card className="relative z-10 bg-card/50 backdrop-blur-sm border-primary/20 p-8 hover:border-primary/50 transition-all hover:scale-105">
                  {/* Numéro */}
                  <div className={`inline-block bg-gradient-to-r ${step.color} text-white px-4 py-2 rounded-lg font-['Orbitron'] font-bold mb-4`}>
                    {step.number}
                  </div>

                  {/* Icône */}
                  <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                    {step.icon}
                  </div>

                  {/* Contenu */}
                  <h3 className="font-['Orbitron'] font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Animation interactive du smart contract */}
          <div className="mb-20">
            <Card className="neon-border bg-card/30 backdrop-blur-sm p-8 md:p-12">
              <h2 className="text-3xl font-['Orbitron'] font-bold text-center mb-8">
                Le Smart Contract en action
              </h2>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Transparent</h4>
                      <p className="text-sm text-muted-foreground">Le code est visible et vérifiable par tous</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Immuable</h4>
                      <p className="text-sm text-muted-foreground">Une fois déployé, impossible de modifier les règles</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Automatique</h4>
                      <p className="text-sm text-muted-foreground">Le tirage s'exécute sans intervention humaine</p>
                    </div>
                  </div>
                </div>

                <div className="relative h-64 bg-background/50 rounded-xl p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  <pre className="text-xs text-primary/80 font-mono relative z-10">
                    {`contract BlockLucky {
  mapping(uint => address) tickets;
  uint public totalTickets;

  function buyTicket() public {
    tickets[totalTickets] = msg.sender;
    totalTickets++;
  }

  function drawWinner() public {
    uint random = getRandomNumber();
    uint winnerIndex = random % totalTickets;
    address winner = tickets[winnerIndex];
    // Transfer prize to winner
  }
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>

          {/* Pourquoi c'est transparent */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-center mb-12">
              Pourquoi c'est transparent ?
            </h2>

            <div className="space-y-6 max-w-3xl mx-auto">
              {whyTransparent.map((item, index) => (
                <Card
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/50 transition-all"
                >
                  <h3 className="font-['Orbitron'] font-bold text-lg mb-3 text-primary">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.answer}
                  </p>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="bg-secondary hover:bg-secondary/90" asChild>
                <a
                  href="https://etherscan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Voir l'explorateur de blocs
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="neon-border bg-gradient-to-br from-primary/10 to-secondary/10 p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl font-['Orbitron'] font-bold mb-4">
                Prêt à participer ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Maintenant que vous comprenez le fonctionnement, il est temps de tenter votre chance !
              </p>
              <Link href="/participer">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold animate-glow"
                >
                  Acheter mes tickets
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
