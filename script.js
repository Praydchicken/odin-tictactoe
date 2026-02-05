const createPlayer = (name, marker) => {
	const getName = () => {
		return name;
	}

	const getMarker = () => {
		return marker;
	}

	return {
		getName,
		getMarker,
	};
}

const gameBoard = (() => {
	const BOARD_SIZE = 9;
	let board = Array(BOARD_SIZE).fill('');

	const getBoard = () => {
		return [...board];
	}

	const getBoardCell = (index) => {
		return board[index];
	}

	const placeMarker = (index, marker) => {
		if (index < 0 || index >= BOARD_SIZE) {
			return false;
		}

		if (board[index]) {
			return false;
		}

		board[index] = marker;
		return true;
	}

	const reset = () => {
		board = Array(BOARD_SIZE).fill('');
	}

	return {
		getBoard,
		getBoardCell,
		placeMarker,
		reset
	};
})();

const gameController = (() => {
	let players = [];
	let currentPlayerIndex = 0;
	let winner = null;
	let isGameOver = false;

	const getGameState = () => {
		return {
			currentPlayer: getCurrentPlayer(),
			winner: winner,
			isGameOver: isGameOver,
			isDraw: isGameOver && !winner
		};
	};

	const setPlayers = (name1, name2) => {
		const player1 = createPlayer(name1 || 'Player 1', 'X');
		const player2 = createPlayer(name2 || 'Player 2', 'O');
		players = [player1, player2];
	};

	const getCurrentPlayer = () => {
		return players[currentPlayerIndex];
	};

	const isWinner = () => {
		const winConditions = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
			[0, 4, 8], [2, 4, 6]             // Diagonals
		];

		const board = gameBoard.getBoard();

		for (let line of winConditions) {
			const [a, b, c] = line;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return true;
			}
		}

		return false;
	};

	const isDraw = () => {
		const board = gameBoard.getBoard();

		return board.every(cell => cell !== '');
	};

	const switchPlayer = () => {
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};

	const makeMove = (index) => {
		if (isGameOver) {
			return false;
		}

		const currentPlayer = getCurrentPlayer();
		const validMove = gameBoard.placeMarker(index, currentPlayer.getMarker());

		if (!validMove) {
			return false;
		}

		if (isWinner()) {
			isGameOver = true;
			winner = currentPlayer;
		} else if (isDraw()) {
			isGameOver = true;
		} else {
			switchPlayer();
		}

		return true;
	};

	const reset = () => {
		gameBoard.reset();
		currentPlayerIndex = 0;
		winner = null;
		isGameOver = false;
	};

	return {
		reset,
		makeMove,
		getGameState,
		setPlayers
	};
})();

const displayController = (() => {
	const boardDisplay = document.querySelector('.board');
	const cellDisplay = document.querySelectorAll('.board__cell');
	const statusDisplay = document.querySelector('.game-status');

	const handleCellClick = (event) => {
		const cell = event.target.closest('.board__cell');

		if (!cell) {
			return;
		}

		gameController.makeMove(cell.dataset.index);
		renderStatusDisplay();
		renderBoardDisplay();
	}

	boardDisplay.addEventListener('click', handleCellClick);

	const renderBoardDisplay = () => {
		const board = gameBoard.getBoard();

		cellDisplay.forEach((cell, index) => {
			cell.textContent = board[index];
		})
	};

	const renderStatusDisplay = () => {
		const { currentPlayer, isDraw, winner, } = gameController.getGameState();

		if (winner) {
			statusDisplay.textContent = `${currentPlayer.getName()} Won!`;
		}
		else if (isDraw) {
			statusDisplay.textContent = "It's a Draw!";
		} else {
			statusDisplay.textContent = `${currentPlayer.getName()}'s Turn`;
		}
	};

	renderStatusDisplay();
})();