import type { WebSocket } from 'ws';
import type { RegData } from '../types';

import { users, players } from '../store/store';
import { clients } from '../store/clients';

import { generateId } from '../utils/id';
import { send } from '../utils/ws';
import { WS_MESSAGE_TYPES, DEFAULT_SCORE, ERROR_MESSAGES } from '../constants';

export function handleRegister(ws: WebSocket, data: RegData) {
  const { name, password } = data;

  if (!name || !password) {
    return send(ws, {
      type: WS_MESSAGE_TYPES.REG,
      data: {
        name: '',
        index: '',
        error: true,
        errorText: ERROR_MESSAGES.INVALID_CREDENTIALS,
      },
      id: 0,
    });
  }

  let user = Array.from(users.values()).find(user => user.name === name);

  if (!user) {
    const userId = generateId();

    user = {
      name,
      password,
      index: userId,
      ws,
    };

    users.set(userId, user);
  }

  const player = {
    name: user.name,
    index: user.index,
    score: DEFAULT_SCORE,
    ws,
  };

  players.set(player.index, player);

  const clientContext = clients.get(ws);
  if (clientContext) {
    clientContext.playerId = player.index;
  }

  send(ws, {
    type: WS_MESSAGE_TYPES.REG,
    data: {
      name: player.name,
      index: player.index,
      error: false,
      errorText: '',
    },
    id: 0,
  });
}