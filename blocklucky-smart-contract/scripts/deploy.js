const hre = require("hardhat");

async function main() {
  console.log("🎫 Déploiement du contrat Lottery...\n");
  
  // Paramètres du contrat
  const ticketPrice = hre.ethers.parseEther("0.01"); // Prix du ticket = 0.01 ETH
  const maxPlayers = 5; // 5 joueurs max
  const durationSeconds = 3600; // 1 heure
  
  console.log("📋 Paramètres:");
  console.log("  - Prix du ticket:", hre.ethers.formatEther(ticketPrice), "ETH");
  console.log("  - Joueurs max:", maxPlayers);
  console.log("  - Durée:", durationSeconds / 60, "minutes\n");
  
  // Déploiement
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(ticketPrice, maxPlayers, durationSeconds);
  
  await lottery.waitForDeployment();
  
  const address = await lottery.getAddress();
  
  console.log("✅ Lottery déployé à l'adresse:", address);
  console.log("\n📋 Copie cette ligne dans ton .env.local:\n");
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
