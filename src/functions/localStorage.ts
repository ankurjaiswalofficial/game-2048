"use client";
import { StorageModel } from '@/types/Models';

const ITEM_NAME = '2048_data';

function isClientSide(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getStoredData(): StorageModel {
	if (!isClientSide()) return {};
	const rawData = localStorage.getItem(ITEM_NAME);
	if (!rawData) return {};

	try {
		const data = JSON.parse(rawData);

		// Validate required properties
		if (
			!Array.isArray(data.board) ||
			typeof data.boardSize !== 'number' ||
			data.board.length !== data.boardSize ** 2 ||
			typeof data.score !== 'number' ||
			typeof data.defeat !== 'boolean' ||
			typeof data.victoryDismissed !== 'boolean'
		) {
			throw new Error('Invalid stored data.');
		}

		// Validate board values
		if (!data.board.every((value: unknown) => typeof value === 'number' && (value === 0 || Math.log2(value) % 1 === 0))) {
			throw new Error('Invalid stored data.');
		}

		// Validate optional properties
		if (data.best !== undefined && typeof data.best !== 'number') {
			throw new Error('Invalid stored data.');
		}

		return {
			board: data.board,
			boardSize: data.boardSize,
			score: data.score,
			defeat: data.defeat,
			victoryDismissed: data.victoryDismissed,
			best: data.best,
		};
	} catch {
		localStorage.removeItem(ITEM_NAME);
		return {};
	}
}

export function setStoredData(model: StorageModel) {
	if (!isClientSide()) return null;
	const data = {
		best: model.best,
		score: model.score,
		board: model.board,
		boardSize: model.boardSize,
		defeat: model.defeat,
		victoryDismissed: model.victoryDismissed,
	};
	localStorage.setItem(ITEM_NAME, JSON.stringify(data));
}
