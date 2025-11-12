// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    // --------- Types & variables ---------
    address public owner;
    uint256 public ticketPrice;          // prix d'un ticket en wei
    uint256 public maxPlayers;           // nombre max de participants avant tirage
    uint256 public deadline;             // timestamp après lequel on peut tirer au sort
    address[] public players;            // liste des participants
    bool public lotteryActive;           // pour éviter de racheter après tirage

    // nouveau : on garde le dernier gagnant
    address public lastWinner;
    uint256 public lastPrize;

    // --------- Events ---------
    event TicketBought(address indexed player, uint256 amount);
    event WinnerPicked(address indexed winner, uint256 prize);
    event LotteryReset(uint256 newDeadline);

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
    }

    // --------- Fonctions principales ---------

    /// @notice Un joueur achète 1 ticket
    function buyTicket() external payable whenActive {
        require(msg.value == ticketPrice, "Wrong ticket price");
        require(block.timestamp <= deadline, "Deadline passed");
        players.push(msg.sender);

        emit TicketBought(msg.sender, msg.value);

        // Si on a atteint le nombre max de joueurs, on peut tirer direct
        if (players.length >= maxPlayers) {
            _pickWinner();
        }
    }

    /// @notice Le propriétaire peut forcer le tirage après la deadline
    function pickWinner() external whenActive {
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

        uint256 prize = address(this).balance;

        // on mémorise le gagnant et le lot
        lastWinner = winner;
        lastPrize = prize;

        // on paie le gagnant
        (bool sent, ) = payable(winner).call{value: prize}("");
        require(sent, "Failed to send Ether");

        emit WinnerPicked(winner, prize);

        // reset pour prochaine loterie
        _resetLottery();
    }

    function _resetLottery() internal {
        delete players; // vide le tableau
        deadline = block.timestamp + 1 days; // prochaine loterie dans 24h (modifiable)
        lotteryActive = true;
        emit LotteryReset(deadline);
    }

    // --------- Fonctions de lecture ---------
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function playersCount() external view returns (uint256) {
        return players.length;
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
        lotteryActive = true;
        emit LotteryReset(deadline);
    }
}
