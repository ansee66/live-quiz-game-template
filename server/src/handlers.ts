import type { WebSocket } from 'ws';

export function handleAnswer(ws: WebSocket, data: any) {
  console.log('handleAnswer', data);
}