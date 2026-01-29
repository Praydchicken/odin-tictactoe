const createPlayer = (name, marker) => {
	return { name, marker };
}

const gameBoard = (() => {
	const BOARD_SIZE = 9;
	let board = Array(BOARD_SIZE).fill('');

	const getBoard = () => {
		return [...board];
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
		placeMarker,
		reset
	};
})();

const gameController = (() => {
	const player1 = createPlayer('Player 1', 'X');
	const player2 = createPlayer('Player 2', 'O');

	const players = [player1, player2];
	let currentPlayerIndex = 0;
	let isGameOver = false;

	const getCurrentPlayer = () => {
		return players[currentPlayerIndex];
	}

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
			return true;
		}

		if (isDraw()) {
			isGameOver = true;
			return true;
		}

		switchPlayer();
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
		isGameOver = false;
	};

	return { startGame, makeMove, getCurrentPlayer };
})();
