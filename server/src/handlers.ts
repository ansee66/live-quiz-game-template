import type { WebSocket } from 'ws';

export function handleJoinGame(ws: WebSocket, data: any) {
  console.log('handleJoinGame', data);
}

export function handleStartGame(ws: WebSocket, data: any) {
  console.log('handleStartGame', data);
}

export function handleAnswer(ws: WebSocket, data: any) {
  console.log('handleAnswer', data);
}