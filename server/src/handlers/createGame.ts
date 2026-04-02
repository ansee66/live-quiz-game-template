import type { WebSocket } from 'ws';
import type { CreateGameData, Game } from '../types';

import { games, gameCodeMap } from '../store/store';
import { clients } from '../store/clients';

import { generateId, generateRoomCode } from '../utils/id';
import { send } from '../utils/ws';

import { GAME_STATUS, WS_MESSAGE_TYPES } from '../constants';

export function handleCreateGame(ws: WebSocket, data: CreateGameData) {
  const client = clients.get(ws);
  if (!client?.playerId) return;

  const { questions } = data;

  if (!questions || questions.length === 0) return;

  const gameId = generateId();
  const code = generateRoomCode();

  const game: Game = {
    id: gameId,
    code,
    hostId: client.playerId,
    questions,
    players: [],
    currentQuestion: -1,
    status: GAME_STATUS.WAITING,
    playerAnswers: new Map(),
  };

  games.set(gameId, game);
  gameCodeMap.set(code, gameId);

  client.gameId = gameId;

  send(ws, {
    type: WS_MESSAGE_TYPES.GAME_CREATED,
    data: {
      gameId,
      code,
    },
    id: 0,
  });
}