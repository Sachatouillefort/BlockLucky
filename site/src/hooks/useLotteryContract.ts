'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { LOTTERY_ABI, LOTTERY_CONTRACT_ADDRESS } from '@/lib/lottery-abi';
import { useState, useEffect } from 'react';

export function useLotteryContract() {
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  // Vérifier que l'adresse du contrat est définie
  const isContractAddressValid = LOTTERY_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Lecture des données du contrat
  const { data: ticketPrice } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'ticketPrice',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: playersCount, refetch: refetchPlayersCount } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'playersCount',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: maxPlayers } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'maxPlayers',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: deadline } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'deadline',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lotteryActive } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'lotteryActive',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: players, refetch: refetchPlayers } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lastWinner } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'lastWinner',
    query: {
      enabled: isContractAddressValid,
    },
  });

  const { data: lastPrize } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: 'lastPrize',
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

  // Écouter les événements du contrat (commenté temporairement pour debug)
  /*
  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'TicketBought',
    onLogs() {
      refetchPlayersCount();
      refetchPlayers();
    },
  });

  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: 'WinnerPicked',
    onLogs() {
      refetchPlayersCount();
      refetchPlayers();
    },
  });
  */

  // Mettre à jour le hash de la dernière transaction
  useEffect(() => {
    if (buyTicketHash) {
      setLastTxHash(buyTicketHash);
    }
  }, [buyTicketHash]);

  const handleBuyTicket = async () => {
    if (!ticketPrice) return;
    
    buyTicket({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: LOTTERY_ABI,
      functionName: 'buyTicket',
      value: ticketPrice,
    });
  };

  const handlePickWinner = async () => {
    pickWinner({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: LOTTERY_ABI,
      functionName: 'pickWinner',
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
    players: players ?? [],
    lastWinner,
    lastPrize: lastPrize ? formatEther(lastPrize) : '0',
    
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
