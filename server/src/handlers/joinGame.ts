import type { WebSocket } from 'ws';
import type { JoinGameData } from '../types';

import { games, gameCodeMap, players } from '../store/store';
import { clients } from '../store/clients';

import { send } from '../utils/ws';
import { broadcastToGame } from '../utils/broadcast';

import { WS_MESSAGE_TYPES } from '../constants';

export function handleJoinGame(ws: WebSocket, data: JoinGameData) {
  const client = clients.get(ws);
  if (!client?.playerId) return;

  const gameId = gameCodeMap.get(data.code);
  if (!gameId) return;

  const game = games.get(gameId);
  if (!game) return;

  const player = players.get(client.playerId);
  if (!player) return;
  if (game.players.some(p => p.index === player.index)) return;

  game.players.push(player);

  client.gameId = gameId;

  send(ws, {
    type: WS_MESSAGE_TYPES.GAME_JOINED,
    data: { gameId },
    id: 0,
  });

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.PLAYER_JOINED,
    data: {
      playerName: player.name,
      playerCount: game.players.length,
    },
    id: 0,
  });

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.UPDATE_PLAYERS,
    data: game.players.map(player => ({
      name: player.name,
      index: player.index,
      score: player.score,
    })),
    id: 0,
  });
}