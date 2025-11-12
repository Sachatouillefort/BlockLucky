"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export default function Decouvrir() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const modules: Module[] = [
    {
      id: "bloc",
      title: "C'est quoi un bloc ?",
      description: "Comprendre la structure de base de la blockchain",
      icon: "🧱",
      color: "from-primary to-primary/50",
      content: {
        question: "Un bloc dans la blockchain contient :",
        options: [
          "Uniquement des transactions financières",
          "Des transactions, un timestamp et le hash du bloc précédent",
          "Seulement du code informatique",
          "Des photos et vidéos"
        ],
        correctAnswer: 1,
        explanation: "Un bloc contient des données de transactions, un horodatage (timestamp), et le hash du bloc précédent. C'est cette structure en chaîne qui rend la blockchain si sécurisée !"
      }
    },
    {
      id: "wallet",
      title: "C'est quoi un wallet ?",
      description: "Découvrir le portefeuille numérique",
      icon: "👛",
      color: "from-secondary to-secondary/50",
      content: {
        question: "Un wallet (portefeuille) permet de :",
        options: [
          "Stocker uniquement de l'argent liquide",
          "Gérer ses clés privées et interagir avec la blockchain",
          "Acheter des bitcoins uniquement",
          "Miner des cryptomonnaies"
        ],
        correctAnswer: 1,
        explanation: "Un wallet stocke vos clés privées qui vous permettent d'accéder à vos cryptomonnaies et d'interagir avec la blockchain. C'est comme votre identité numérique !"
      }
    },
    {
      id: "smart-contract",
      title: "C'est quoi un smart contract ?",
      description: "Les programmes auto-exécutables",
      icon: "📜",
      color: "from-primary to-secondary",
      content: {
        question: "Un smart contract est :",
        options: [
          "Un contrat papier scanné",
          "Un programme qui s'exécute automatiquement sur la blockchain",
          "Un avocat spécialisé en blockchain",
          "Une application mobile"
        ],
        correctAnswer: 1,
        explanation: "Un smart contract est un programme informatique déployé sur la blockchain qui s'exécute automatiquement quand certaines conditions sont remplies. Pas besoin d'intermédiaire !"
      }
    },
    {
      id: "ethereum",
      title: "C'est quoi Ethereum ?",
      description: "La plateforme de smart contracts",
      icon: "⟠",
      color: "from-secondary to-primary",
      content: {
        question: "Ethereum permet de :",
        options: [
          "Uniquement échanger de l'argent",
          "Créer des applications décentralisées et des smart contracts",
          "Acheter des bitcoins",
          "Stocker des fichiers"
        ],
        correctAnswer: 1,
        explanation: "Ethereum est une plateforme blockchain qui permet de créer des applications décentralisées (dApps) et d'exécuter des smart contracts. C'est comme un ordinateur mondial !"
      }
    }
  ];

  const badges = [
    { id: "beginner", title: "Débutant", icon: "🌱", required: 1 },
    { id: "learner", title: "Apprenant", icon: "📚", required: 2 },
    { id: "expert", title: "Expert", icon: "🎓", required: 3 },
    { id: "master", title: "Maître", icon: "🏆", required: 4 },
  ];

  const progress = (completedModules.length / modules.length) * 100;

  const handleAnswer = (moduleId: string, answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const currentModule = modules.find(m => m.id === moduleId);
    if (currentModule && answerIndex === currentModule.content.correctAnswer) {
      if (!completedModules.includes(moduleId)) {
        setCompletedModules([...completedModules, moduleId]);
      }
    }
  };

  const resetModule = () => {
    setActiveModule(null);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const currentBadge = badges.reduce((acc, badge) => {
    return completedModules.length >= badge.required ? badge : acc;
  }, badges[0]);

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="relative min-h-screen pt-20">
        <div className="container mx-auto px-4 py-20">
          {/* Titre */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-bold mb-4 neon-text">
              Découvrir la blockchain
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Apprenez les concepts fondamentaux à travers des modules interactifs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Modules */}
            <div className="lg:col-span-2 space-y-6">
              {!activeModule ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {modules.map((module) => {
                      const isCompleted = completedModules.includes(module.id);

                      return (
                        <Card
                          key={module.id}
                          className={`bg-card/50 backdrop-blur-sm border-primary/20 p-6 cursor-pointer hover:border-primary/50 transition-all hover:scale-105 ${
                            isCompleted ? 'border-secondary/50' : ''
                          }`}
                          onClick={() => setActiveModule(module.id)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`text-5xl animate-float`} style={{ animationDelay: `${modules.indexOf(module) * 0.2}s` }}>
                              {module.icon}
                            </div>
                            {isCompleted && (
                              <Badge className="bg-secondary/20 text-secondary border-secondary/50">
                                ✓ Terminé
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-['Orbitron'] font-bold text-xl mb-2">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {module.description}
                          </p>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/50 hover:bg-primary/10"
                          >
                            {isCompleted ? "Revoir" : "Commencer"}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : (
                // Module actif
                <Card className="neon-border bg-card/50 backdrop-blur-sm p-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetModule}
                    className="mb-6"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                  </Button>

                  {(() => {
                    const currentModule = modules.find(m => m.id === activeModule);
                    if (!currentModule) return null;

                    return (
                      <>
                        <div className="text-center mb-8">
                          <div className="text-6xl mb-4">{currentModule.icon}</div>
                          <h2 className="text-3xl font-['Orbitron'] font-bold mb-3">
                            {currentModule.title}
                          </h2>
                          <p className="text-muted-foreground">{currentModule.description}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">
                              {currentModule.content.question}
                            </h3>

                            <div className="space-y-3">
                              {currentModule.content.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentModule.content.correctAnswer;
                                const showCorrect = showResult && isCorrect;
                                const showWrong = showResult && isSelected && !isCorrect;

                                return (
                                  <button
                                    key={index}
                                    onClick={() => !showResult && handleAnswer(currentModule.id, index)}
                                    disabled={showResult}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                      showCorrect
                                        ? 'border-secondary bg-secondary/20'
                                        : showWrong
                                        ? 'border-destructive bg-destructive/20'
                                        : isSelected
                                        ? 'border-primary bg-primary/10'
                                        : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'
                                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{option}</span>
                                      {showCorrect && <span className="text-2xl">✓</span>}
                                      {showWrong && <span className="text-2xl">✗</span>}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {showResult && (
                            <div className={`border rounded-lg p-6 animate-float ${
                              selectedAnswer === currentModule.content.correctAnswer
                                ? 'bg-secondary/10 border-secondary/30'
                                : 'bg-destructive/10 border-destructive/30'
                            }`}>
                              <div className="flex items-start gap-3 mb-3">
                                <div className="text-3xl">
                                  {selectedAnswer === currentModule.content.correctAnswer ? '🎉' : '💡'}
                                </div>
                                <div>
                                  <h4 className="font-bold mb-2">
                                    {selectedAnswer === currentModule.content.correctAnswer
                                      ? 'Bravo ! Réponse correcte !'
                                      : 'Pas tout à fait...'}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {currentModule.content.explanation}
                                  </p>
                                </div>
                              </div>

                              <Button
                                onClick={resetModule}
                                className="w-full mt-4 bg-primary hover:bg-primary/90"
                              >
                                Continuer
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </Card>
              )}
            </div>

            {/* Sidebar - Progression et badges */}
            <div className="space-y-6">
              {/* Progression */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6">
                <h3 className="font-['Orbitron'] font-bold text-lg mb-4">
                  Ma progression
                </h3>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Modules complétés</span>
                    <span className="font-bold">{completedModules.length}/{modules.length}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="text-center mt-6">
                  <div className="text-5xl mb-2 animate-float">
                    {currentBadge.icon}
                  </div>
                  <Badge className={`bg-gradient-to-r ${
                    completedModules.length >= 4 ? 'from-primary to-secondary' :
                    completedModules.length >= 3 ? 'from-primary to-primary/50' :
                    completedModules.length >= 2 ? 'from-secondary to-secondary/50' :
                    'from-muted to-muted'
                  } text-white px-4 py-2`}>
                    {currentBadge.title}
                  </Badge>
                </div>
              </Card>

              {/* Tous les badges */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6">
                <h3 className="font-['Orbitron'] font-bold text-lg mb-4">
                  Badges à débloquer
                </h3>

                <div className="space-y-3">
                  {badges.map((badge) => {
                    const isUnlocked = completedModules.length >= badge.required;

                    return (
                      <div
                        key={badge.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30'
                            : 'bg-muted/20 opacity-50'
                        }`}
                      >
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{badge.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {badge.required} module{badge.required > 1 ? 's' : ''}
                          </div>
                        </div>
                        {isUnlocked && (
                          <div className="text-secondary">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Bonus */}
              {completedModules.length === modules.length && (
                <Card className="neon-border bg-gradient-to-br from-primary/20 to-secondary/20 p-6 animate-glow">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🎊</div>
                    <h3 className="font-['Orbitron'] font-bold mb-2">
                      Félicitations !
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous êtes maintenant un Explorateur d'EtherBay certifié !
                    </p>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
                      🏆 Maître de la Blockchain
                    </Badge>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
