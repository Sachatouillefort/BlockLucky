// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DailyLottery {
    // --------- Types & variables ---------
    address public owner;
    uint256 public ticketPrice;          // prix d'un ticket en wei
    uint256 public maxPlayers;           // nombre max de participants avant tirage
    uint256 public deadline;             // timestamp après lequel on peut tirer au sort
    address[] public players;            // liste des participants
    bool public lotteryActive;           // pour éviter de racheter après tirage
    uint256 public currentDay;           // jour actuel (0 = jour 1, 1 = jour 2, 2 = jour 3)

    // Structure pour un gagnant
    struct Winner {
        address winnerAddress;
        uint256 prizeDay;
        uint256 timestamp;
    }

    // Historique des gagnants
    Winner[] public winners;
    mapping(uint256 => Winner) public dailyWinners; // jour => gagnant

    // Dernier gagnant (pour compatibilité)
    address public lastWinner;
    uint256 public lastPrizeDay;

    // --------- Events ---------
    event TicketBought(address indexed player, uint256 amount);
    event WinnerPicked(address indexed winner, uint256 prizeDay, string prizeName);
    event LotteryReset(uint256 newDeadline, uint256 day);

    // --------- Modifiers ---------
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier whenActive() {
        require(lotteryActive, "Lottery not active");
        _;
    }

    constructor(
        uint256 _ticketPrice,
        uint256 _maxPlayers,
        uint256 _durationSeconds
    ) {
        require(_ticketPrice > 0, "Ticket price must be > 0");
        require(_maxPlayers > 1, "Need at least 2 players");
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        maxPlayers = _maxPlayers;
        deadline = block.timestamp + _durationSeconds;
        lotteryActive = true;
        currentDay = 0; // Commence au jour 1 (prix 1)
    }

    // --------- Fonctions principales ---------

    /// @notice Un joueur achète 1 ticket
    function buyTicket() external payable whenActive {
        require(msg.value == ticketPrice, "Wrong ticket price");
        require(block.timestamp <= deadline, "Deadline passed");
        require(currentDay < 3, "All prizes have been won");
        players.push(msg.sender);

        emit TicketBought(msg.sender, msg.value);

        // Si on a atteint le nombre max de joueurs, on peut tirer direct
        if (players.length >= maxPlayers) {
            _pickWinner();
        }
    }

    /// @notice Le propriétaire peut forcer le tirage après la deadline
    function pickWinner() external onlyOwner whenActive {
        require(block.timestamp > deadline, "Too early");
        require(players.length > 0, "No players");
        _pickWinner();
    }

    // --------- Fonctions internes ---------
    function _pickWinner() internal {
        // ⚠️ pseudo-random pour démo
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
        uint256 winnerIndex = random % players.length;
        address winner = players[winnerIndex];

        // Enregistrer le gagnant
        Winner memory newWinner = Winner({
            winnerAddress: winner,
            prizeDay: currentDay + 1, // jour 1, 2 ou 3
            timestamp: block.timestamp
        });

        winners.push(newWinner);
        dailyWinners[currentDay] = newWinner;

        // Mise à jour pour compatibilité
        lastWinner = winner;
        lastPrizeDay = currentDay + 1;

        // Émettre l'événement avec le nom du prix
        string memory prizeName = _getPrizeName(currentDay);
        emit WinnerPicked(winner, currentDay + 1, prizeName);

        // Passer au jour suivant
        currentDay++;

        // reset pour prochaine loterie
        _resetLottery();
    }

    function _resetLottery() internal {
        delete players; // vide le tableau
        
        if (currentDay < 3) {
            // Prochaine loterie dans 24h
            deadline = block.timestamp + 1 days;
            lotteryActive = true;
            emit LotteryReset(deadline, currentDay + 1);
        } else {
            // Tous les prix ont été gagnés
            lotteryActive = false;
            emit LotteryReset(0, 0);
        }
    }

    function _getPrizeName(uint256 day) internal pure returns (string memory) {
        if (day == 0) return "Rue a ton nom";
        if (day == 1) return "2 Acces VIP EtherBay";
        if (day == 2) return "Transports gratuits + Parking";
        return "Unknown";
    }

    // --------- Fonctions de lecture ---------
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function playersCount() external view returns (uint256) {
        return players.length;
    }

    function getCurrentPrizeName() external view returns (string memory) {
        if (currentDay >= 3) return "All prizes won";
        return _getPrizeName(currentDay);
    }

    function getWinners() external view returns (Winner[] memory) {
        return winners;
    }

    // --------- Admin ---------
    function stopLottery() external onlyOwner {
        lotteryActive = false;
    }

    function startNewLottery(uint256 _durationSeconds, uint256 _maxPlayers) external onlyOwner {
        require(!lotteryActive, "Lottery already active");
        delete players;
        maxPlayers = _maxPlayers;
        deadline = block.timestamp + _durationSeconds;
        currentDay = 0;
        lotteryActive = true;
        
        // Reset winners
        delete winners;
        delete dailyWinners[0];
        delete dailyWinners[1];
        delete dailyWinners[2];
        
        emit LotteryReset(deadline, 1);
    }

    // Fonction pour retirer les fonds (au cas où)
    function withdraw() external onlyOwner {
        require(!lotteryActive, "Lottery still active");
        payable(owner).transfer(address(this).balance);
    }
}
