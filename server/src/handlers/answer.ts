import type { WebSocket } from 'ws';
import type { AnswerData } from '../types';

import { games } from '../store/store';
import { clients } from '../store/clients';

import { send } from '../utils/ws';
import { WS_MESSAGE_TYPES, GAME_STATUS } from '../constants';
import { endQuestion } from '../game/engine';

export function handleAnswer(ws: WebSocket, data: AnswerData) {
  const client = clients.get(ws);
  if (!client?.playerId) return;

  const game = games.get(data.gameId);
  if (!game) return;

  if (game.status !== GAME_STATUS.IN_PROGRESS) return;

  if (data.questionIndex !== game.currentQuestion) return;
  if (data.answerIndex < 0 || data.answerIndex > 3) return;

  const player = game.players.find(p => p.index === client.playerId);
  if (!player) return;
  if (player.hasAnswered) return;

  const question = game.questions[game.currentQuestion];
  const now = Date.now();

  if (!game.questionStartTime) return;
  if (now - game.questionStartTime > question.timeLimitSec * 1000) return;

  player.hasAnswered = true;
  player.answerTime = now;

  game.playerAnswers.set(player.index, {
    answerIndex: data.answerIndex,
    timestamp: now,
  });

  send(ws, {
    type: WS_MESSAGE_TYPES.ANSWER_ACCEPTED,
    data: {
      questionIndex: data.questionIndex,
    },
    id: 0,
  });

  const allAnswered = game.players.every(player => player.hasAnswered);

  if (allAnswered && game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = undefined;

    endQuestion(game.id);
  }
}