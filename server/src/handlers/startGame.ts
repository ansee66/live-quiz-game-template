import type { WebSocket } from 'ws';
import type { StartGameData } from '../types';

import { games } from '../store/store';
import { clients } from '../store/clients';

import { broadcastToGame } from '../utils/broadcast';

import { WS_MESSAGE_TYPES, GAME_STATUS } from '../constants';

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
  const question = game.questions[0];

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.QUESTION,
    data: {
      questionNumber: 1,
      totalQuestions: game.questions.length,
      text: question.text,
      options: question.options,
      timeLimitSec: question.timeLimitSec,
    },
    id: 0,
  });
}