import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initializeBoard,
  BoardType,
  updateBoard,
  movePossible,
} from '@/functions/board';
import { Direction } from '@/types/Direction';
import { getStoredData, setStoredData } from '@/functions/localStorage';
import { Animation } from '@/types/Animations';
import { defaultBoardSize, victoryTileValue } from '@/configs/config';

export interface StateType {
  /** Board size. Currently always 4. */
  boardSize: number;

  /** Current board. */
  board: BoardType;

  /** Previous board. */
  previousBoard?: BoardType;

  /** Was 2048 tile found? */
  victory: boolean;

  /** Is game over? */
  defeat: boolean;

  /** Should the victory screen be hidden? */
  victoryDismissed: boolean;

  /** Current score. */
  score: number;

  /** Score increase after last update. */
  scoreIncrease?: number;

  /** Best score. */
  best: number;

  /** Used for certain animations. Mainly as a value of the "key" property. */
  moveId?: string;

  /** Animations after last update. */
  animations?: Animation[];
}

const storedData = getStoredData();

const initialState: StateType = {
  boardSize: storedData.boardSize ?? defaultBoardSize,
  board: storedData.board || initializeBoard(defaultBoardSize).board,
  defeat: storedData.defeat || false,
  victory: false,
  victoryDismissed: storedData.victoryDismissed || false,
  score: storedData.score ?? 0,
  best: storedData.best ?? 0,
  moveId: new Date().getTime().toString(),
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    reset(state, action: PayloadAction<number | undefined>) {
      const size = action.payload || state.boardSize;
      const update = initializeBoard(size);
      state.boardSize = size;
      state.board = update.board;
      state.score = 0;
      state.animations = update.animations;
      state.previousBoard = undefined;
      state.victory = false;
      state.victoryDismissed = false;
    },
    move(state, action: PayloadAction<Direction>) {
      if (state.defeat) return;

      const direction = action.payload;
      const update = updateBoard(state.board, direction);
      state.previousBoard = [...state.board];
      state.board = update.board;
      state.score += update.scoreIncrease;
      state.animations = update.animations;
      state.scoreIncrease = update.scoreIncrease;
      state.moveId = new Date().getTime().toString();
    },
    undo(state) {
      if (!state.previousBoard) return;

      state.board = state.previousBoard;
      state.previousBoard = undefined;

      if (state.scoreIncrease) {
        state.score -= state.scoreIncrease;
      }
    },
    dismissVictory(state) {
      state.victoryDismissed = true;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      () => true, // Always save state after any action
      (state) => {
        if (state.score > state.best) {
          state.best = state.score;
        }

        state.defeat = !movePossible(state.board);
        state.victory = !!state.board.find(
          (value) => value === victoryTileValue
        );
        setStoredData(state);
      }
    );
  },
});

export const { reset, move, undo, dismissVictory } = applicationSlice.actions;
export default applicationSlice.reducer;
