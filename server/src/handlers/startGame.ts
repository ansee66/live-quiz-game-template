import type { WebSocket } from 'ws';
import type { StartGameData } from '../types';

import { games } from '../store/store';
import { clients } from '../store/clients';

import { GAME_STATUS } from '../constants';
import { sendQuestion } from '../game/engine';

export function handleStartGame(ws: WebSocket, data: StartGameData) {
  const client = clients.get(ws);
  if (!client?.playerId) return;

  const gameId = data.gameId;
  const game = games.get(gameId);
  if (!game) return;

  if (game.hostId !== client.playerId) return;
  if (game.status !== GAME_STATUS.WAITING) return;
  if (game.players.length === 0) return;

  game.status = GAME_STATUS.IN_PROGRESS;
  game.currentQuestion = 0;
  sendQuestion(gameId);
}