import { Direction } from '@/types/Direction';
import { Animation, AnimationType } from '@/types/Animations';

export type BoardType = number[];

export function newTileValue() {
	return Math.random() > 0.1 ? 2 : 4;
}

function containsEmpty(board: BoardType): boolean {
	return board.includes(0);
}

interface NewTileResult {
	board: BoardType;
	index?: number;
}

function newTile(board: BoardType): NewTileResult {
	if (!containsEmpty(board)) {
		return { board };
	}

	let index: number;
	do {
		index = Math.floor(Math.random() * board.length);
	} while (board[index] !== 0);

	board[index] = newTileValue();
	return { board, index };
}

export interface BoardUpdate {
	board: BoardType;
	animations?: Animation[];
	scoreIncrease: number;
}

export function initializeBoard(boardSize: number): BoardUpdate {
	const board = new Array(boardSize ** 2).fill(0);
	const animations: Animation[] = [];

	// Spawn two tiles at first.
	for (let i = 0; i < 2; i++) {
		const result = newTile(board);
		if (result.index !== undefined) {
			animations.push({
				type: AnimationType.NEW,
				index: result.index,
			});
		}
	}

	return { board, scoreIncrease: 0, animations };
}

function getRotatedIndex(index: number, boardSize: number, direction: Direction): number {
	const x = index % boardSize;
	const y = Math.floor(index / boardSize);

	switch (direction) {
		case Direction.LEFT:
			return (boardSize - 1 - x) * boardSize + y;
		case Direction.RIGHT:
			return x * boardSize + (boardSize - 1 - y);
		case Direction.UP:
			return (boardSize - 1 - y) * boardSize + (boardSize - 1 - x);
		default:
			return index; // Direction.DOWN
	}
}

function rotateBoard(board: BoardType, direction: Direction, undo = false): BoardType {
	if (direction === Direction.DOWN) return [...board];

	const boardSize = Math.sqrt(board.length);
	const newBoard = new Array(board.length);

	const effectiveDirection = undo
		? direction === Direction.LEFT
			? Direction.RIGHT
			: direction === Direction.RIGHT
			? Direction.LEFT
			: direction
		: direction;

	for (let i = 0; i < board.length; i++) {
		const index = getRotatedIndex(i, boardSize, effectiveDirection);
		newBoard[index] = board[i];
	}

	return newBoard;
}

export function rotateAnimations(animations: Animation[], boardSize: number, direction: Direction): Animation[] {
	if (direction === Direction.DOWN) return animations;

	const effectiveDirection = direction === Direction.LEFT ? Direction.RIGHT : direction === Direction.RIGHT ? Direction.LEFT : direction;

	return animations.map((animation) => ({
		...animation,
		index: getRotatedIndex(animation.index, boardSize, effectiveDirection),
	}));
}

export function updateBoard(board: BoardType, direction: Direction): BoardUpdate {
	const boardSize = Math.sqrt(board.length);
	board = rotateBoard(board, direction);

	let changed = false;
	let scoreIncrease = 0;
	const animations: Animation[] = [];
	let lastMergedIndex: number | undefined;

	for (let col = 0; col < boardSize; col++) {
		for (let row = boardSize - 2; row >= 0; row--) {
			const initialIndex = row * boardSize + col;
			if (board[initialIndex] === 0) continue;

			let i = initialIndex;
			let below = i + boardSize;
			let merged = false;

			while (board[below] === 0 || (!merged && board[i] === board[below])) {
				if (below === lastMergedIndex) break;

				changed = true;

				if (board[below] !== 0) {
					merged = true;
					scoreIncrease += board[i] * 2;
				}

				board[below] += board[i];
				board[i] = 0;
				i = below;
				below = i + boardSize;
			}

			if (i !== initialIndex) {
				animations.push({
					type: AnimationType.MOVE,
					index: initialIndex,
					direction,
					value: Math.floor((i - initialIndex) / boardSize),
				});

				if (merged) {
					lastMergedIndex = i;
					animations.push({
						type: AnimationType.MERGE,
						index: i,
					});
				}
			}
		}
	}

	board = rotateBoard(board, direction, true);

	if (changed) {
		const result = newTile(board);
		board = result.board;
		if (result.index !== undefined) {
			animations.push({
				type: AnimationType.NEW,
				index: result.index,
			});
		}
	}

	return { board, scoreIncrease, animations };
}

export function movePossible(board: BoardType): boolean {
	const boardSize = Math.sqrt(board.length);

	if (containsEmpty(board)) return true;

	for (let i = 0; i < board.length; i++) {
		if (
			(i % boardSize !== boardSize - 1 && board[i] === board[i + 1]) || // Check right
			(i < board.length - boardSize && board[i] === board[i + boardSize]) // Check below
		) {
			return true;
		}
	}

	return false;
}
