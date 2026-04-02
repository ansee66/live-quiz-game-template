import type { WebSocket } from 'ws';
import type { WSMessage } from './types';
import { WS_MESSAGE_TYPES, ERROR_MESSAGES } from './constants';
import { handleAnswer, handleJoinGame, handleStartGame } from './handlers';
import { handleRegister } from './handlers/register';
import { handleCreateGame } from './handlers/createGame';


type Handler = (ws: WebSocket, data: any) => void;

const handlers: Record<string, Handler> = {
  [WS_MESSAGE_TYPES.REG]: handleRegister,
  [WS_MESSAGE_TYPES.CREATE_GAME]: handleCreateGame,
  [WS_MESSAGE_TYPES.JOIN_GAME]: handleJoinGame,
  [WS_MESSAGE_TYPES.START_GAME]: handleStartGame,
  [WS_MESSAGE_TYPES.ANSWER]: handleAnswer,
};

export function handleMessage(ws: WebSocket, message: WSMessage) {
  const handler = handlers[message.type];

  if (!handler) {
    console.error(ERROR_MESSAGES.UNKNOWN_MESSAGE_TYPE, message.type);
    return;
  }

  handler(ws, message.data);
}