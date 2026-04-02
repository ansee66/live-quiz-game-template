import type { WebSocket } from 'ws';

import { clients } from '../store/clients';
import { games } from '../store/store';
import { broadcastToGame } from '../utils/broadcast';

import { GAME_STATUS, WS_MESSAGE_TYPES } from '../constants';
import { endQuestion } from '../game/engine';

export function handleDisconnect(ws: WebSocket) {
  const client = clients.get(ws);
  if (!client) return;

  const { playerId, gameId } = client;
  clients.delete(ws);
  if (!playerId || !gameId) return;

  const game = games.get(gameId);
  if (!game) return;

  if (game.hostId === playerId) {
    game.status = GAME_STATUS.FINISHED;

    broadcastToGame(gameId, {
      type: WS_MESSAGE_TYPES.GAME_FINISHED,
      data: { scoreboard: [] },
      id: 0,
    });

    return;
  }

  game.players = game.players.filter(p => p.index !== playerId);
  game.playerAnswers.delete(playerId);

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.UPDATE_PLAYERS,
    data: game.players.map(p => ({
      name: p.name,
      index: p.index,
      score: p.score,
    })),
    id: 0,
  });

  if (game.status === GAME_STATUS.IN_PROGRESS) {
    const allAnswered = game.players.every(p => p.hasAnswered);

    if (allAnswered && game.questionTimer) {
      clearTimeout(game.questionTimer);
      game.questionTimer = undefined;
      endQuestion(gameId);
    }
  }
}