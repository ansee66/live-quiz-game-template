import { WebSocketServer } from 'ws';
import { DEFAULT_PORT, ERROR_MESSAGES } from './constants';
import { handleMessage } from './router';
import { clients } from './store/clients';
import { handleDisconnect } from './handlers/disconnect';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  clients.set(ws, {});

  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(raw.toString());
      handleMessage(ws, message);
    } catch (e) {
      console.error(ERROR_MESSAGES.INVALID_JSON);
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });
});

console.log(`WS running on ws://localhost:${PORT}`);