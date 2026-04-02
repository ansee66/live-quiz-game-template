import { games } from '../store/store';
import { send } from './ws';

export function broadcastToGame(gameId: string, payload: unknown) {
  const game = games.get(gameId);
  if (!game) return;

  for (const player of game.players) {
    if (player.ws) {
      send(player.ws, payload);
    }
  }

  if (game.hostWs) {
    send(game.hostWs, payload);
  }
}