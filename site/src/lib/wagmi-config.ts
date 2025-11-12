import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, hardhat, localhost } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'BlockLucky - Lottery DApp',
  // Utilisez votre propre Project ID en production
  // Obtenez-en un gratuitement sur https://cloud.walletconnect.com
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4d9b3f4e5c6d7e8f9a0b1c2d3e4f5a6b',
  chains: [
    localhost,
    hardhat,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_MAINNET === 'true' ? [mainnet] : []),
  ],
  ssr: true,
});
