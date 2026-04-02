import type { WebSocket } from 'ws';

export function send(ws: WebSocket, payload: unknown) {
  ws.send(JSON.stringify(payload));
}