import type { WebSocket } from 'ws';

export interface ClientContext {
  playerId?: string;
  gameId?: string;
}

export const clients = new Map<WebSocket, ClientContext>();