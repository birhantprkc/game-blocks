import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BOARD_SIZE,
  createGameRound,
  type GameBoard,
  type GamePiece,
  type GameRound,
  placeGamePiece,
} from '../../src/components/game/game-engine';

function createEmptyBoard(): GameBoard {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function createPiece(
  id: string,
  cells: GamePiece['cells'] = [[0, 0]]
): GamePiece {
  return { cells, color: 'yellow', id, key: id };
}

function createRound(board: GameBoard, pieces: GameRound['pieces']): GameRound {
  return {
    board,
    combo: 0,
    generation: 1,
    movesWithoutClear: 0,
    pieces,
    score: 0,
  };
}

describe('game engine', () => {
  it('creates the documented classic opening without sharing mutable boards', () => {
    const first = createGameRound('classic', '2026-07-17');
    const second = createGameRound('classic', '2026-07-17');

    assert.equal(first.board.length, BOARD_SIZE);
    assert.ok(first.board.every((row) => row.every((cell) => cell === null)));
    assert.deepEqual(
      first.pieces.map((piece) => piece?.id),
      ['initial-line-a', 'initial-line-b', 'initial-line-c']
    );

    const mutableFirst = createGameRound('classic', '2026-07-17');
    mutableFirst.board[0][0] = 'red';
    assert.equal(second.board[0][0], null);
  });

  it('rejects invalid placements without mutating the round', () => {
    const round = createGameRound('classic', '2026-07-17');
    const snapshot = structuredClone(round);

    assert.equal(
      placeGamePiece(round, { column: 7, pieceIndex: 0, row: 0 }),
      null
    );
    assert.deepEqual(round, snapshot);
  });

  it('clears a row and returns a pre-clear visual snapshot', () => {
    const board = createEmptyBoard();
    board[0] = ['red', 'red', 'red', 'red', 'red', 'red', 'red', null];
    const resolution = placeGamePiece(
      createRound(board, [createPiece('single'), null, null]),
      { column: 7, pieceIndex: 0, row: 0 }
    );

    assert.ok(resolution);
    assert.equal(resolution.clear?.lineCount, 1);
    assert.equal(Object.keys(resolution.clear?.cells ?? {}).length, 8);
    assert.ok(resolution.round.board[0].every((cell) => cell === null));
    assert.equal(resolution.round.combo, 1);
    assert.equal(resolution.round.score, 11);
  });

  it('counts crossing row and column clears once for cells and twice for score', () => {
    const board = createEmptyBoard();
    for (let index = 0; index < BOARD_SIZE; index += 1) {
      if (index === 4) continue;
      board[4][index] = 'blue';
      board[index][4] = 'green';
    }
    const resolution = placeGamePiece(
      createRound(board, [createPiece('single'), null, null]),
      { column: 4, pieceIndex: 0, row: 4 }
    );

    assert.ok(resolution);
    assert.equal(resolution.clear?.lineCount, 2);
    assert.equal(Object.keys(resolution.clear?.cells ?? {}).length, 15);
    assert.equal(resolution.round.score, 21);
  });

  it('advances combo before calculating clear points', () => {
    const board = createEmptyBoard();
    board[0] = ['red', 'red', 'red', 'red', 'red', 'red', 'red', null];
    const round = createRound(board, [createPiece('single'), null, null]);
    round.combo = 1;
    const resolution = placeGamePiece(round, {
      column: 7,
      pieceIndex: 0,
      row: 0,
    });

    assert.ok(resolution);
    assert.equal(resolution.round.combo, 2);
    assert.equal(resolution.round.score, 21);
  });

  it('refills the tray deterministically after the third piece', () => {
    let round = createGameRound('classic', '2026-07-17');
    const moves = [
      { column: 0, pieceIndex: 0, row: 0 },
      { column: 0, pieceIndex: 1, row: 1 },
      { column: 0, pieceIndex: 2, row: 2 },
    ];

    for (const move of moves) {
      const resolution = placeGamePiece(round, move);
      assert.ok(resolution);
      round = resolution.round;
    }

    assert.equal(round.generation, 2);
    assert.deepEqual(
      round.pieces.map((piece) => piece?.id),
      ['2-0-line-2-v', '2-1-tee', '2-2-line-2-h']
    );
  });

  it('reports game over when none of the remaining pieces can fit', () => {
    const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, column) =>
        (row + column) % 2 === 0 ? 'blue' : null
      )
    ) satisfies GameBoard;
    const largePiece = createPiece('large', [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]);
    const resolution = placeGamePiece(
      createRound(board, [createPiece('single'), largePiece, null]),
      { column: 1, pieceIndex: 0, row: 0 }
    );

    assert.ok(resolution);
    assert.equal(resolution.gameOver, true);
  });
});
