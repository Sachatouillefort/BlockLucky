export const DAILY_LOTTERY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`;

// Prix quotidiens de la loterie
export const DAILY_PRIZES = [
  {
    day: 1,
    name: "La rue de ton choix prend ton nom",
    description: "Une rue de la ville portera ton nom pendant un an",
    icon: "🏛️",
    color: "from-yellow-500 to-orange-500"
  },
  {
    day: 2,
    name: "2 Accès VIP à tout event dans EtherBay",
    description: "Accès illimité à tous les événements VIP pendant un an",
    icon: "🎭",
    color: "from-purple-500 to-pink-500"
  },
  {
    day: 3,
    name: "Un an de transports gratuits + parking",
    description: "Transports en commun gratuits et parking illimité pendant un an",
    icon: "🚇",
    color: "from-blue-500 to-cyan-500"
  }
];

export const DAILY_LOTTERY_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_ticketPrice", type: "uint256" },
      { internalType: "uint256", name: "_maxPlayers", type: "uint256" },
      { internalType: "uint256", name: "_durationSeconds", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "newDeadline", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "day", type: "uint256" }
    ],
    name: "LotteryReset",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "TicketBought",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "prizeDay", type: "uint256" },
      { indexed: false, internalType: "string", name: "prizeName", type: "string" }
    ],
    name: "WinnerPicked",
    type: "event"
  },
  {
    inputs: [],
    name: "buyTicket",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "currentDay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "dailyWinners",
    outputs: [
      { internalType: "address", name: "winnerAddress", type: "address" },
      { internalType: "uint256", name: "prizeDay", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "deadline",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentPrizeName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "day", type: "uint256" }],
    name: "getDailyWinner",
    outputs: [
      {
        components: [
          { internalType: "address", name: "winnerAddress", type: "address" },
          { internalType: "uint256", name: "prizeDay", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" }
        ],
        internalType: "struct DailyLottery.Winner",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getPlayers",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "day", type: "uint256" }],
    name: "getPrizeForDay",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "getRemainingTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getWinners",
    outputs: [
      {
        components: [
          { internalType: "address", name: "winnerAddress", type: "address" },
          { internalType: "uint256", name: "prizeDay", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" }
        ],
        internalType: "struct DailyLottery.Winner[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lastPrizeDay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lastWinner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lotteryActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxPlayers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pickWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "players",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "playersCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_durationSeconds", type: "uint256" },
      { internalType: "uint256", name: "_maxPlayers", type: "uint256" }
    ],
    name: "startNewLottery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "stopLottery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "ticketPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "winners",
    outputs: [
      { internalType: "address", name: "winnerAddress", type: "address" },
      { internalType: "uint256", name: "prizeDay", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
