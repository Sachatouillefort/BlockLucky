# 📜 Guide Complet : Smart Contract DailyLottery

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du Smart Contract](#architecture-du-smart-contract)
3. [Fonctionnement Détaillé](#fonctionnement-détaillé)
4. [Intégration avec le Frontend](#intégration-avec-le-frontend)
5. [Flux de Données](#flux-de-données)
6. [Sécurité](#sécurité)
7. [Cas d'Usage](#cas-dusage)

---

## 🎯 Vue d'ensemble

**DailyLottery** est un smart contract Solidity qui gère une loterie sur 3 jours avec un prix différent chaque jour.

### Concept

```
Jour 1 → Prix 1 : Rue à ton nom
Jour 2 → Prix 2 : 2 Accès VIP EtherBay  
Jour 3 → Prix 3 : Transports gratuits + Parking
```

Chaque jour :
1. Les utilisateurs achètent des tickets (0.01 ETH)
2. Un gagnant est tiré au sort
3. Le système passe au jour suivant automatiquement

---

## 🏗️ Architecture du Smart Contract

### Structure des Données

```solidity
contract DailyLottery {
    // Variables d'état principales
    address public owner;              // Propriétaire du contrat
    uint256 public ticketPrice;        // Prix d'un ticket (ex: 0.01 ETH)
    uint256 public maxPlayers;         // Nombre max de joueurs
    uint256 public deadline;           // Timestamp limite pour participer
    address[] public players;          // Liste des participants
    bool public lotteryActive;         // État de la loterie
    uint256 public currentDay;         // Jour actuel (0, 1, ou 2)
    
    // Structure pour stocker un gagnant
    struct Winner {
        address winnerAddress;         // Adresse du gagnant
        uint256 prizeDay;              // Jour du prix (1, 2, ou 3)
        uint256 timestamp;             // Date/heure du tirage
    }
    
    // Historique
    Winner[] public winners;           // Tous les gagnants
    mapping(uint256 => Winner) public dailyWinners; // Gagnant par jour
}
```

### Modificateurs

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

modifier whenActive() {
    require(lotteryActive, "Lottery not active");
    _;
}
```

---

## ⚙️ Fonctionnement Détaillé

### 1️⃣ Déploiement du Contrat

**Quand :** Au lancement du projet avec `./start.sh`

**Script de déploiement :** `scripts/deploy-daily.js`

```javascript
const TICKET_PRICE = ethers.parseEther("0.01");    // 0.01 ETH
const MAX_PLAYERS = 10;                            // 10 joueurs max
const LOTTERY_DURATION = 60 * 60 * 24;             // 24 heures

const DailyLottery = await ethers.getContractFactory("DailyLottery");
const lottery = await DailyLottery.deploy(
    TICKET_PRICE,
    MAX_PLAYERS,
    LOTTERY_DURATION
);
```

**Ce qui se passe :**
1. Le contrat est déployé sur la blockchain Hardhat locale
2. `currentDay` est initialisé à `0` (= Jour 1)
3. `deadline` est fixé à `maintenant + 24h`
4. `lotteryActive` passe à `true`
5. L'adresse du contrat est sauvegardée dans `site/.env.local`

---

### 2️⃣ Achat d'un Ticket

**Fonction :** `buyTicket()`

```solidity
function buyTicket() external payable whenActive {
    require(msg.value == ticketPrice, "Wrong ticket price");
    require(block.timestamp <= deadline, "Deadline passed");
    require(currentDay < 3, "All prizes have been won");
    
    players.push(msg.sender);
    emit TicketBought(msg.sender, msg.value);
    
    // Auto-tirage si nombre max atteint
    if (players.length >= maxPlayers) {
        _pickWinner();
    }
}
```

**Étapes :**

1. **Validation du paiement**
   - Vérifie que le montant envoyé = `ticketPrice`
   - Si incorrect → transaction échoue

2. **Vérification de la deadline**
   - Vérifie que la deadline n'est pas dépassée
   - Si dépassée → transaction échoue

3. **Vérification du jour**
   - Vérifie que `currentDay < 3` (pas tous les prix gagnés)
   - Si terminé → transaction échoue

4. **Enregistrement du joueur**
   - Ajoute l'adresse du joueur dans `players[]`
   - Émet un événement `TicketBought`

5. **Auto-tirage (optionnel)**
   - Si `players.length >= maxPlayers`
   - Lance automatiquement `_pickWinner()`

---

### 3️⃣ Tirage au Sort

**Fonction :** `pickWinner()` (owner) ou `_pickWinner()` (interne)

```solidity
function _pickWinner() internal {
    // 1. Génération aléatoire (⚠️ pseudo-random pour démo)
    uint256 random = uint256(
        keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                players.length,
                address(this).balance
            )
        )
    );
    
    // 2. Sélection du gagnant
    uint256 winnerIndex = random % players.length;
    address winner = players[winnerIndex];
    
    // 3. Enregistrement
    Winner memory newWinner = Winner({
        winnerAddress: winner,
        prizeDay: currentDay + 1,    // 1, 2, ou 3
        timestamp: block.timestamp
    });
    
    winners.push(newWinner);
    dailyWinners[currentDay] = newWinner;
    lastWinner = winner;
    lastPrizeDay = currentDay + 1;
    
    // 4. Événement
    string memory prizeName = _getPrizeName(currentDay);
    emit WinnerPicked(winner, currentDay + 1, prizeName);
    
    // 5. Passage au jour suivant
    currentDay++;
    _resetLottery();
}
```

**Étapes détaillées :**

1. **Génération aléatoire**
   - Combine plusieurs sources d'entropie
   - `block.timestamp` : horodatage du bloc
   - `block.prevrandao` : nombre aléatoire du bloc
   - `players.length` : nombre de participants
   - `address(this).balance` : solde du contrat
   - ⚠️ Pour la production, utiliser Chainlink VRF

2. **Sélection du gagnant**
   - `winnerIndex = random % players.length`
   - Exemple : si `random = 12345` et `players.length = 7`
   - Alors `winnerIndex = 12345 % 7 = 4`
   - Le gagnant est `players[4]`

3. **Enregistrement du gagnant**
   - Création d'une structure `Winner`
   - Ajout dans `winners[]` (tableau complet)
   - Ajout dans `dailyWinners[currentDay]` (mapping par jour)
   - Mise à jour de `lastWinner` et `lastPrizeDay`

4. **Émission d'événement**
   - `WinnerPicked(winner, prizeDay, prizeName)`
   - Le frontend écoute cet événement
   - Affichage automatique du gagnant

5. **Passage au jour suivant**
   - `currentDay++` (0→1, 1→2, 2→3)
   - Appel de `_resetLottery()`

---

### 4️⃣ Réinitialisation

**Fonction :** `_resetLottery()`

```solidity
function _resetLottery() internal {
    delete players;  // Vide le tableau des joueurs
    
    if (currentDay < 3) {
        // Il reste des jours
        deadline = block.timestamp + 1 days;
        lotteryActive = true;
        emit LotteryReset(deadline, currentDay + 1);
    } else {
        // Tous les prix ont été gagnés
        lotteryActive = false;
        emit LotteryReset(0, 0);
    }
}
```

**Comportement :**

- **Si `currentDay < 3`** (il reste des jours) :
  - Vide `players[]`
  - `deadline = maintenant + 24h`
  - `lotteryActive = true`
  - Prêt pour le prochain jour

- **Si `currentDay >= 3`** (tous les prix gagnés) :
  - `lotteryActive = false`
  - Plus de participation possible
  - La loterie est terminée

---

### 5️⃣ Fonctions de Lecture

Ces fonctions permettent au frontend de récupérer les données.

```solidity
// Obtenir tous les joueurs
function getPlayers() external view returns (address[] memory) {
    return players;
}

// Nombre de joueurs
function playersCount() external view returns (uint256) {
    return players.length;
}

// Nom du prix actuel
function getCurrentPrizeName() external view returns (string memory) {
    if (currentDay >= 3) return "All prizes won";
    return _getPrizeName(currentDay);
}

// Tous les gagnants
function getWinners() external view returns (Winner[] memory) {
    return winners;
}
```

**Fonction privée pour les noms de prix :**

```solidity
function _getPrizeName(uint256 day) internal pure returns (string memory) {
    if (day == 0) return "Rue a ton nom";
    if (day == 1) return "2 Acces VIP EtherBay";
    if (day == 2) return "Transports gratuits + Parking";
    return "Unknown";
}
```

---

### 6️⃣ Fonctions Admin

Réservées au propriétaire du contrat (`owner`).

```solidity
// Arrêter la loterie en urgence
function stopLottery() external onlyOwner {
    lotteryActive = false;
}

// Lancer une nouvelle session
function startNewLottery(uint256 _durationSeconds, uint256 _maxPlayers) 
    external onlyOwner {
    require(!lotteryActive, "Lottery already active");
    delete players;
    maxPlayers = _maxPlayers;
    deadline = block.timestamp + _durationSeconds;
    currentDay = 0;
    lotteryActive = true;
    // Reset winners
    delete winners;
    emit LotteryReset(deadline, 1);
}

// Retirer les fonds
function withdraw() external onlyOwner {
    require(!lotteryActive, "Lottery still active");
    payable(owner).transfer(address(this).balance);
}
```

---

## 🔗 Intégration avec le Frontend

### Architecture Frontend

```
site/
├── src/
│   ├── lib/
│   │   └── daily-lottery-abi.ts       # ABI + Configuration
│   ├── hooks/
│   │   └── useDailyLotteryContract.ts # Hook personnalisé
│   └── app/
│       ├── page.tsx                   # Accueil
│       ├── participer/page.tsx        # Achat de tickets
│       └── tirage/page.tsx            # Page de tirage
```

---

### 1️⃣ Configuration : `daily-lottery-abi.ts`

```typescript
// Adresse du contrat (auto-générée au déploiement)
export const DAILY_LOTTERY_CONTRACT_ADDRESS = 
    process.env.NEXT_PUBLIC_DAILY_LOTTERY_ADDRESS as `0x${string}`;

// ABI du contrat (interface)
export const DAILY_LOTTERY_ABI = [
    {
        type: "function",
        name: "buyTicket",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
    },
    {
        type: "function",
        name: "getPlayers",
        inputs: [],
        outputs: [{ type: "address[]" }],
        stateMutability: "view",
    },
    // ... autres fonctions
];

// Définition des prix
export const DAILY_PRIZES = [
    {
        day: 1,
        name: "🏛️ La rue de ton choix prend ton nom",
        description: "Une rue de la ville portera votre nom !",
        icon: "🏛️",
        color: "from-blue-500 to-purple-600"
    },
    {
        day: 2,
        name: "🎭 2 Accès VIP à tout event dans EtherBay",
        description: "Accès illimité aux événements blockchain",
        icon: "🎭",
        color: "from-purple-500 to-pink-600"
    },
    {
        day: 3,
        name: "🚇 Un an de transports gratuits + parking",
        description: "Transports en commun et parking gratuits pendant 1 an",
        icon: "🚇",
        color: "from-green-500 to-teal-600"
    }
];
```

**Rôle :**
- Stocke l'adresse du contrat
- Définit l'ABI (interface du contrat)
- Contient les informations des 3 prix

---

### 2️⃣ Hook Personnalisé : `useDailyLotteryContract.ts`

Ce hook encapsule toute la logique d'interaction avec le contrat.

```typescript
export function useDailyLotteryContract() {
    // 1. LECTURE DES DONNÉES
    
    // Prix d'un ticket
    const { data: ticketPrice } = useReadContract({
        address: DAILY_LOTTERY_CONTRACT_ADDRESS,
        abi: DAILY_LOTTERY_ABI,
        functionName: 'ticketPrice',
    });
    
    // Nombre de joueurs
    const { data: playersCount } = useReadContract({
        address: DAILY_LOTTERY_CONTRACT_ADDRESS,
        abi: DAILY_LOTTERY_ABI,
        functionName: 'playersCount',
    });
    
    // Jour actuel
    const { data: currentDay } = useReadContract({
        address: DAILY_LOTTERY_CONTRACT_ADDRESS,
        abi: DAILY_LOTTERY_ABI,
        functionName: 'currentDay',
    });
    
    // ... autres lectures
    
    // 2. ÉCRITURE (ACHETER UN TICKET)
    
    const { 
        writeContract: buyTicket, 
        isPending: isBuyingTicket,
    } = useWriteContract();
    
    const handleBuyTicket = async () => {
        if (!ticketPrice) return;
        
        buyTicket({
            address: DAILY_LOTTERY_CONTRACT_ADDRESS,
            abi: DAILY_LOTTERY_ABI,
            functionName: 'buyTicket',
            value: ticketPrice, // Montant en wei
        });
    };
    
    // 3. RETOUR DES DONNÉES FORMATÉES
    
    return {
        // Données formatées
        ticketPrice: ticketPrice ? formatEther(ticketPrice) : '0',
        playersCount: playersCount ? Number(playersCount) : 0,
        currentDay: currentDay ? Number(currentDay) : 0,
        currentPrize: DAILY_PRIZES[currentDay || 0],
        
        // Actions
        buyTicket: handleBuyTicket,
        
        // États
        isBuyingTicket,
        isConfirmed,
        
        // Erreurs
        buyTicketError,
    };
}
```

**Avantages du hook :**
- ✅ Centralise la logique blockchain
- ✅ Formate automatiquement les données (BigInt → Number, wei → ETH)
- ✅ Gère les états de chargement
- ✅ Simplifie l'utilisation dans les composants

---

### 3️⃣ Utilisation dans les Composants

#### Page Accueil (`page.tsx`)

```typescript
export default function Home() {
    const { playersCount, currentDay, winners, allPrizes } = 
        useDailyLotteryContract();
    
    return (
        <main>
            {/* Affichage du nombre de participants */}
            <p>Donateurs engagés : {playersCount || 0}</p>
            
            {/* Affichage des 3 prix */}
            {allPrizes.map((prize, index) => (
                <DailyPrizeCard
                    key={prize.day}
                    {...prize}
                    isToday={index === currentDay}
                    isWon={index < currentDay}
                />
            ))}
        </main>
    );
}
```

#### Page Participer (`participer/page.tsx`)

```typescript
export default function Participer() {
    const { address, isConnected } = useAccount();
    
    const {
        ticketPrice,
        playersCount,
        maxPlayers,
        lotteryActive,
        currentPrize,
        buyTicket,
        isBuyingTicket,
        isConfirmed,
        buyTicketError,
    } = useDailyLotteryContract();
    
    return (
        <main>
            {/* Affichage du prix du jour */}
            <Card>
                <h3>{currentPrize?.name}</h3>
                <p>{currentPrize?.description}</p>
            </Card>
            
            {/* Bouton d'achat */}
            <Button
                onClick={buyTicket}
                disabled={!isConnected || isBuyingTicket || !lotteryActive}
            >
                {isBuyingTicket 
                    ? "Transaction en cours..." 
                    : `Acheter un ticket (${ticketPrice} ETH)`
                }
            </Button>
            
            {/* Statistiques */}
            <p>Participants : {playersCount} / {maxPlayers}</p>
            
            {/* Messages */}
            {buyTicketError && <p>Erreur : {buyTicketError.message}</p>}
            {isConfirmed && <p>✅ Ticket acheté avec succès !</p>}
        </main>
    );
}
```

#### Page Tirage (`tirage/page.tsx`)

```typescript
export default function Tirage() {
    const { address } = useAccount();
    
    const {
        deadline,
        lastWinner,
        lastPrizeDay,
        currentPrize,
        winners,
        pickWinner,
        isPickingWinner,
    } = useDailyLotteryContract();
    
    // Calcul du compte à rebours
    const [timeLeft, setTimeLeft] = useState({
        hours: 0, minutes: 0, seconds: 0
    });
    
    useEffect(() => {
        const timer = setInterval(() => {
            const diff = deadline - Math.floor(Date.now() / 1000);
            setTimeLeft({
                hours: Math.floor(diff / 3600),
                minutes: Math.floor((diff % 3600) / 60),
                seconds: diff % 60,
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [deadline]);
    
    // Vérifier si l'utilisateur est le gagnant
    const isWinner = address && lastWinner && 
        address.toLowerCase() === lastWinner.toLowerCase();
    
    return (
        <main>
            {/* Compte à rebours */}
            <div>
                <span>{timeLeft.hours}h</span>
                <span>{timeLeft.minutes}m</span>
                <span>{timeLeft.seconds}s</span>
            </div>
            
            {/* Bouton de tirage (owner) */}
            <Button onClick={pickWinner} disabled={isPickingWinner}>
                Lancer le tirage
            </Button>
            
            {/* Affichage du gagnant */}
            {lastWinner && (
                <Card>
                    <h2>Félicitations au gagnant !</h2>
                    <p>Adresse : {lastWinner}</p>
                    <p>Prix : {DAILY_PRIZES[lastPrizeDay - 1].name}</p>
                    
                    {isWinner && (
                        <WinnerFormModal prize={DAILY_PRIZES[lastPrizeDay - 1]} />
                    )}
                </Card>
            )}
            
            {/* Historique */}
            {winners.map((winner) => (
                <div key={winner.timestamp}>
                    <span>{winner.address}</span>
                    <span>{winner.prizeName}</span>
                </div>
            ))}
        </main>
    );
}
```

---

## 🔄 Flux de Données Complet

### Schéma Global

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEUR                           │
│              (Navigateur + MetaMask)                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 1. Clic "Acheter ticket"
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useDailyLotteryContract()                       │   │
│  │    → buyTicket()                                 │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 2. Appel fonction contrat
                        │    buyTicket() + 0.01 ETH
                        ▼
┌─────────────────────────────────────────────────────────┐
│               WAGMI + VIEM (Web3)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useWriteContract()                              │   │
│  │    → Signe la transaction                        │   │
│  │    → Envoie via RPC                              │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 3. Transaction signée
                        ▼
┌─────────────────────────────────────────────────────────┐
│            BLOCKCHAIN (Hardhat Local)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DailyLottery.sol                                │   │
│  │    1. Vérifie le montant                         │   │
│  │    2. Vérifie la deadline                        │   │
│  │    3. Ajoute dans players[]                      │   │
│  │    4. Émet TicketBought                          │   │
│  │    5. Si maxPlayers → _pickWinner()              │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 4. Transaction confirmée
                        │    Event émis
                        ▼
┌─────────────────────────────────────────────────────────┐
│               WAGMI (Écoute Events)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  useWaitForTransactionReceipt()                  │   │
│  │    → Détecte la confirmation                     │   │
│  │    → isConfirmed = true                          │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ 5. Mise à jour UI
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Réaction)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - Affiche "✅ Ticket acheté !"                  │   │
│  │  - Met à jour playersCount                       │   │
│  │  - Cache le spinner de chargement               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

### Cycle Complet d'une Journée

```
JOUR 1 (currentDay = 0)
├─ 00:00 → Loterie démarre (deadline = 00:00 + 24h)
├─ 00:05 → Alice achète un ticket
├─ 00:10 → Bob achète un ticket
├─ 00:15 → Charlie achète un ticket
├─ ...
├─ 23:50 → 10 tickets vendus → Auto-tirage !
│          ↓
│          1. Génération aléatoire
│          2. Sélection de Bob (par exemple)
│          3. Enregistrement :
│             - winners[0] = { Bob, day 1, timestamp }
│             - dailyWinners[0] = { Bob, day 1, timestamp }
│             - lastWinner = Bob
│          4. Event : WinnerPicked(Bob, 1, "Rue a ton nom")
│          5. currentDay++ → currentDay = 1
│          6. Reset : players = [], deadline = maintenant + 24h
│
JOUR 2 (currentDay = 1)
├─ 00:00 → Nouvelle loterie (deadline = 00:00 + 24h)
├─ 00:05 → David achète un ticket
├─ ...
│
JOUR 3 (currentDay = 2)
├─ 00:00 → Dernière loterie
├─ ...
├─ 23:50 → Gagnant désigné
│          ↓
│          currentDay++ → currentDay = 3
│          lotteryActive = false
│          
FIN (currentDay = 3)
└─ Loterie terminée, plus de participation possible
```

---

## 🔒 Sécurité

### Mécanismes de Sécurité Implémentés

#### 1. Modificateurs

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```
- Seul le propriétaire peut appeler certaines fonctions
- Protège : `pickWinner()`, `stopLottery()`, `withdraw()`

```solidity
modifier whenActive() {
    require(lotteryActive, "Lottery not active");
    _;
}
```
- Empêche l'achat de tickets si loterie inactive
- Protège : `buyTicket()`

#### 2. Validations

```solidity
require(msg.value == ticketPrice, "Wrong ticket price");
```
- Montant exact requis, ni plus ni moins
- Empêche les erreurs de paiement

```solidity
require(block.timestamp <= deadline, "Deadline passed");
```
- Pas d'achat après la deadline
- Garantit l'équité

```solidity
require(currentDay < 3, "All prizes have been won");
```
- Empêche la participation après le dernier jour

#### 3. Transparence

- Toutes les variables sont `public`
- Tous les gagnants sont enregistrés
- Tous les événements sont émis
- Impossible de tricher (blockchain immuable)

### ⚠️ Limitations Actuelles

#### 1. Génération Aléatoire

```solidity
// ⚠️ PSEUDO-RANDOM (pour démo uniquement)
uint256 random = uint256(
    keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        players.length,
        address(this).balance
    ))
);
```

**Problème :** Un mineur pourrait théoriquement influencer le résultat.

**Solution pour la production :**
```solidity
// Utiliser Chainlink VRF (Verifiable Random Function)
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract DailyLottery is VRFConsumerBase {
    // ... code sécurisé avec vraie génération aléatoire
}
```

#### 2. Pas de Reentrancy Guard

**À ajouter pour la production :**
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DailyLottery is ReentrancyGuard {
    function buyTicket() external payable nonReentrant {
        // ...
    }
}
```

---

## 💼 Cas d'Usage

### Scénario 1 : Achat Normal

```
1. Alice visite http://localhost:3000/participer
2. Connecte MetaMask
3. Clique sur "Acheter un ticket (0.01 ETH)"
4. MetaMask demande confirmation
5. Alice confirme
6. Transaction envoyée à la blockchain
7. Contrat vérifie :
   ✓ Montant = 0.01 ETH
   ✓ Deadline non dépassée
   ✓ currentDay < 3
8. Alice est ajoutée à players[]
9. Event TicketBought émis
10. Frontend affiche "✅ Ticket acheté !"
11. playersCount passe de 3 à 4
```

### Scénario 2 : Auto-Tirage

```
1. Bob est le 10ème joueur (maxPlayers = 10)
2. Bob achète un ticket
3. Contrat vérifie : players.length = 10
4. Condition atteinte → _pickWinner() lancé automatiquement
5. Gagnant sélectionné : Alice (players[3])
6. Alice enregistrée comme gagnante
7. Event WinnerPicked(Alice, 1, "Rue a ton nom")
8. currentDay++ → passe à 1
9. players[] vidé
10. Nouvelle deadline fixée
11. Frontend détecte l'event
12. Affiche "🎉 Alice a gagné !"
13. Si Alice est connectée → Modal de formulaire
```

### Scénario 3 : Tirage Manuel (Owner)

```
1. Deadline dépassée mais pas de tirage auto
2. Owner va sur la page /tirage
3. Clique sur "Lancer le tirage"
4. Contrat vérifie :
   ✓ msg.sender == owner
   ✓ block.timestamp > deadline
   ✓ players.length > 0
5. _pickWinner() exécuté
6. Gagnant désigné et enregistré
7. Événements émis
8. Frontend mis à jour
```

### Scénario 4 : Fin de Loterie

```
1. currentDay = 2 (Jour 3)
2. Dernier tirage effectué
3. _resetLottery() appelé
4. currentDay++ → currentDay = 3
5. Condition : currentDay >= 3
6. lotteryActive = false
7. Event LotteryReset(0, 0)
8. Frontend affiche "Loterie terminée"
9. Bouton "Acheter" désactivé
10. Affichage des 3 gagnants
```

---

## 📊 Monitoring et Événements

### Événements Émis

```solidity
event TicketBought(address indexed player, uint256 amount);
event WinnerPicked(address indexed winner, uint256 prizeDay, string prizeName);
event LotteryReset(uint256 newDeadline, uint256 day);
```

### Écoute dans le Frontend

```typescript
// Wagmi écoute automatiquement les events via useWatchContractEvent
useWatchContractEvent({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    eventName: 'WinnerPicked',
    onLogs(logs) {
        console.log('Nouveau gagnant !', logs);
        // Rafraîchir les données
        refetch();
    },
});
```

---

## 🎓 Résumé

### Points Clés

1. **Smart Contract = Backend Décentralisé**
   - Pas de serveur central
   - Code immuable sur la blockchain
   - Transactions transparentes

2. **3 Jours, 3 Prix**
   - Cycle automatique jour après jour
   - Un gagnant par jour
   - Réinitialisation automatique

3. **Intégration Frontend**
   - Wagmi + Viem pour Web3
   - Hook personnalisé pour simplifier
   - Réactivité en temps réel

4. **Sécurité**
   - Validations strictes
   - Modificateurs de contrôle
   - Événements pour transparence

### Architecture Complète

```
┌──────────────────────────────────────────────────────┐
│                    UTILISATEUR                        │
│                   (MetaMask)                          │
└──────────────────────┬───────────────────────────────┘
                       │
                       │ Transactions
                       │
┌──────────────────────▼───────────────────────────────┐
│              FRONTEND (Next.js + Wagmi)              │
│  ┌────────────────────────────────────────────────┐  │
│  │  useDailyLotteryContract()                     │  │
│  │    - Lit les données (useReadContract)         │  │
│  │    - Écrit les transactions (useWriteContract) │  │
│  │    - Formate pour l'affichage                  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
                       │ JSON-RPC
                       │
┌──────────────────────▼───────────────────────────────┐
│            BLOCKCHAIN (Hardhat Local)                 │
│  ┌────────────────────────────────────────────────┐  │
│  │  DailyLottery.sol                              │  │
│  │    - Gère l'état (players, currentDay, etc.)  │  │
│  │    - Valide les transactions                   │  │
│  │    - Tire les gagnants                         │  │
│  │    - Émet les événements                       │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Commandes Utiles

```bash
# Compiler le contrat
cd blocklucky-smart-contract
npx hardhat compile

# Déployer localement
npx hardhat run scripts/deploy-daily.js --network localhost

# Lancer le projet complet
./start.sh

# Vérifier les logs Hardhat
# (dans le terminal où Hardhat tourne)

# Tester le frontend
cd site
npm run dev
```

---

## 🔗 Ressources Supplémentaires

- [Documentation Solidity](https://docs.soliditylang.org/)
- [Documentation Wagmi](https://wagmi.sh/)
- [Documentation Viem](https://viem.sh/)
- [Hardhat Docs](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction)

---

<div align="center">

**📘 Guide créé le 20 Novembre 2025**

**BlockLucky - Loterie Décentralisée sur Blockchain**

[📖 README](./README.md) | [📐 STRUCTURE](./STRUCTURE.md) | [📝 CHANGELOG](./CHANGELOG.md)

</div>
