'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { DAILY_LOTTERY_ABI, DAILY_LOTTERY_CONTRACT_ADDRESS, DAILY_PRIZES } from '@/lib/daily-lottery-abi';
import { useState, useEffect } from 'react';

export function useDailyLotteryContract() {
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  // Vérifier que l'adresse du contrat est définie
  const isContractAddressValid = DAILY_LOTTERY_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Lecture des données du contrat
  const { data: ticketPrice } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'ticketPrice',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: playersCount, refetch: refetchPlayersCount } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'playersCount',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: maxPlayers } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'maxPlayers',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: deadline } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'deadline',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lotteryActive } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'lotteryActive',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: currentDay } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'currentDay',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: players, refetch: refetchPlayers } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'getPlayers',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lastWinner } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'lastWinner',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lastPrizeDay } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'lastPrizeDay',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: currentPrizeName } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'getCurrentPrizeName',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: winners } = useReadContract({
    address: DAILY_LOTTERY_CONTRACT_ADDRESS,
    abi: DAILY_LOTTERY_ABI,
    functionName: 'getWinners',
    query: {
      enabled: isContractAddressValid,
    },
  });

  // Écriture sur le contrat
  const { 
    writeContract: buyTicket, 
    data: buyTicketHash,
    isPending: isBuyingTicket,
    error: buyTicketError 
  } = useWriteContract();

  const { 
    writeContract: pickWinner, 
    isPending: isPickingWinner,
    error: pickWinnerError 
  } = useWriteContract();

  // Attendre la confirmation de la transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: buyTicketHash,
  });

  // Mettre à jour le hash de la dernière transaction
  useEffect(() => {
    if (buyTicketHash) {
      setLastTxHash(buyTicketHash);
    }
  }, [buyTicketHash]);

  const handleBuyTicket = async () => {
    if (!ticketPrice) return;
    
    buyTicket({
      address: DAILY_LOTTERY_CONTRACT_ADDRESS,
      abi: DAILY_LOTTERY_ABI,
      functionName: 'buyTicket',
      value: ticketPrice,
    });
  };

  const handlePickWinner = async () => {
    pickWinner({
      address: DAILY_LOTTERY_CONTRACT_ADDRESS,
      abi: DAILY_LOTTERY_ABI,
      functionName: 'pickWinner',
    });
  };

  // Obtenir les informations du prix actuel
  const getCurrentPrize = () => {
    const day = currentDay !== undefined ? Number(currentDay) : 0;
    return DAILY_PRIZES[day] || DAILY_PRIZES[0];
  };

  // Obtenir tous les gagnants avec leurs prix
  const getWinnersWithPrizes = () => {
    if (!winners) return [];
    
    return (winners as any[]).map((winner: any) => {
      const prizeDay = Number(winner.prizeDay);
      const prize = DAILY_PRIZES[prizeDay - 1];
      
      return {
        address: winner.winnerAddress,
        prizeDay,
        prizeName: prize?.name || 'Unknown',
        prizeIcon: prize?.icon || '🎁',
        timestamp: Number(winner.timestamp),
      };
    });
  };

  return {
    // Données
    ticketPrice: ticketPrice ? formatEther(ticketPrice) : '0',
    ticketPriceWei: ticketPrice,
    playersCount: playersCount ? Number(playersCount) : 0,
    maxPlayers: maxPlayers ? Number(maxPlayers) : 0,
    deadline: deadline ? Number(deadline) : 0,
    lotteryActive: lotteryActive ?? false,
    currentDay: currentDay ? Number(currentDay) : 0,
    players: players ?? [],
    lastWinner,
    lastPrizeDay: lastPrizeDay ? Number(lastPrizeDay) : 0,
    currentPrizeName: currentPrizeName || '',
    winners: getWinnersWithPrizes(),
    
    // Prix
    currentPrize: getCurrentPrize(),
    allPrizes: DAILY_PRIZES,
    
    // Actions
    buyTicket: handleBuyTicket,
    pickWinner: handlePickWinner,
    
    // États
    isBuyingTicket: isBuyingTicket || isConfirming,
    isPickingWinner,
    isConfirmed,
    lastTxHash,
    
    // Erreurs
    buyTicketError,
    pickWinnerError,
  };
}
