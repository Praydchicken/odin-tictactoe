const createPlayer = (name, marker) => {
	let score = 0;

	const getName = () => {
		return name;
	}

	const getMarker = () => {
		return marker;
	}

	const getScore = () => {
		return score;
	}

	const addScore = () => {
		score++;
		return score;
	};


	return {
		getName,
		getMarker,
		getScore,
		addScore
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
	const player1 = createPlayer('Player 1', 'X');
	const player2 = createPlayer('Player 2', 'O');

	const players = [player1, player2];
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

	const makeMove = (index) => {
		if (isGameOver) {
			return false;
		}

		const validMove = gameBoard.placeMarker(index, getCurrentPlayer().marker);

		if (!validMove) {
			return false;
		}

		if (isWinner()) {
			isGameOver = true;
			winner = getCurrentPlayer();
		} else if (isDraw()) {
			isGameOver = true;
		} else {
			switchPlayer();
		}

		return true;
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
	}

	const isDraw = () => {
		const board = gameBoard.getBoard();

		return board.every(cell => cell !== '');
	}

	const switchPlayer = () => {
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};

	const startGame = () => {
		gameBoard.reset();
		currentPlayerIndex = 0;
		winner = null;
		winningLine = null;
		isGameOver = false;
	};

	return {
		startGame,
		makeMove,
		getGameState
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
		const { currentPlayer, isDraw ,winner } = gameController.getGameState();

		if (winner) {
			statusDisplay.textContent = `${winner.name} Won!`;
		}
		else if (isDraw) {
			statusDisplay.textContent = "It's a Draw!";
		} else {
			statusDisplay.textContent = `${currentPlayer.name}'s Turn`;
		}
	}

	renderStatusDisplay();
})();