import { games } from '../store/store';
import { broadcastToGame } from '../utils/broadcast';
import { WS_MESSAGE_TYPES, BASE_POINTS, GAME_STATUS } from '../constants';

export function sendQuestion(gameId: string) {
  const game = games.get(gameId);
  if (!game) return;

  const questionIndex = game.currentQuestion;
  const question = game.questions[questionIndex];

  game.playerAnswers.clear();

  for (const player of game.players) {
    player.hasAnswered = false;
    player.answerTime = undefined;
    player.answeredCorrectly = undefined;
  }

  game.questionStartTime = Date.now();

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.QUESTION,
    data: {
      questionNumber: questionIndex + 1,
      totalQuestions: game.questions.length,
      text: question.text,
      options: question.options,
      timeLimitSec: question.timeLimitSec,
    },
    id: 0,
  });

  game.questionTimer = setTimeout(() => {
    endQuestion(gameId);
  }, question.timeLimitSec * 1000);
}

export function endQuestion(gameId: string) {
  const game = games.get(gameId);
  if (!game) return;

  const question = game.questions[game.currentQuestion];

  const results = game.players.map(player => {
    const answer = game.playerAnswers.get(player.index);

    let answered = false;
    let correct = false;
    let pointsEarned = 0;

    if (answer) {
      answered = true;
      correct = answer.answerIndex === question.correctIndex;

      if (correct && game.questionStartTime) {
        const timeSpent = answer.timestamp - game.questionStartTime;
        const timeLimitMs = question.timeLimitSec * 1000;

        const timeRemaining = Math.max(timeLimitMs - timeSpent, 0);

        pointsEarned = Math.floor(
          BASE_POINTS * (timeRemaining / timeLimitMs)
        );

        player.score += pointsEarned;
      }
    }

    return {
      name: player.name,
      answered,
      correct,
      pointsEarned,
      totalScore: player.score,
    };
  });

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.QUESTION_RESULT,
    data: {
      questionIndex: game.currentQuestion,
      correctIndex: question.correctIndex,
      playerResults: results,
    },
    id: 0,
  });

  proceedToNextStep(gameId);
}

function proceedToNextStep(gameId: string) {
  const game = games.get(gameId);
  if (!game) return;

  const isLastQuestion =
    game.currentQuestion >= game.questions.length - 1;

  if (isLastQuestion) {
    finishGame(gameId);
    return;
  }

  game.currentQuestion += 1;

  sendQuestion(gameId);
}

function finishGame(gameId: string) {
  const game = games.get(gameId);
  if (!game) return;

  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = undefined;
  }

  game.status = GAME_STATUS.FINISHED;

  const sortedPlayers = [...game.players].sort(
    (a, b) => b.score - a.score
  );

  let currentRank = 1;

  const scoreboard = sortedPlayers.map((player, index) => {
    if (index > 0) {
      const prev = sortedPlayers[index - 1];
      if (player.score < prev.score) {
        currentRank = index + 1;
      }
    }

    return {
      name: player.name,
      score: player.score,
      rank: currentRank,
    };
  });

  broadcastToGame(gameId, {
    type: WS_MESSAGE_TYPES.GAME_FINISHED,
    data: {
      scoreboard,
    },
    id: 0,
  });
}