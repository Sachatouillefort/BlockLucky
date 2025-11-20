import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-primary/20 bg-background/80 backdrop-blur-lg mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-['Orbitron']">BL</span>
              </div>
              <span className="text-xl font-['Orbitron'] font-bold neon-text">
                BlockLucky
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Marathon caritatif sur blockchain où 100% des dons sont reversés aux associations locales d'Etherbay.
              Transparence totale, lots symboliques, impact réel.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-['Orbitron'] font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="text-muted-foreground hover:text-primary transition-colors">
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link href="/participer" className="text-muted-foreground hover:text-primary transition-colors">
                  Participer
                </Link>
              </li>
              <li>
                <Link href="/tirage" className="text-muted-foreground hover:text-primary transition-colors">
                  Tirage
                </Link>
              </li>
              <li>
                <Link href="/decouvrir" className="text-muted-foreground hover:text-primary transition-colors">
                  Streamers
                </Link>
              </li>
            </ul>
          </div>

          {/* Associations */}
          <div>
            <h3 className="font-['Orbitron'] font-bold mb-4">Associations</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                📚 EtherKids <br />
                <span className="text-xs">Éducation & Jeunesse</span>
              </li>
              <li className="text-muted-foreground">
                🌱 GreenBay <br />
                <span className="text-xs">Environnement & Énergie</span>
              </li>
              <li className="text-muted-foreground">
                🎭 Art4All <br />
                <span className="text-xs">Culture & Inclusion</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 BlockLucky Live. Marathon caritatif autorisé par la mairie d'Etherbay.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-xs bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
              Powered by Ethereum
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
