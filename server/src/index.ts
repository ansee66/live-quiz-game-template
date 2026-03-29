import { WebSocketServer } from 'ws';


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// WebSocket server
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(raw.toString());
      console.log('Incoming:', message);
    } catch (e) {
      console.error('Invalid JSON');
    }
  });
});