export const DEFAULT_PORT = 3000;

export const DEFAULT_SCORE = 0;

export const WS_MESSAGE_TYPES = {
  REG: 'reg',
  CREATE_GAME: 'create_game',
  GAME_CREATED: 'game_created',
  JOIN_GAME: 'join_game',
  GAME_JOINED: 'game_joined',
  PLAYER_JOINED: 'player_joined',
  UPDATE_PLAYERS: 'update_players',
  START_GAME: 'start_game',
  ANSWER: 'answer',
  QUESTION: 'question',
} as const;

export const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON',
  UNKNOWN_MESSAGE_TYPE: 'Unknown message type',
  INVALID_CREDENTIALS: 'Invalid credentials',
} as const;

export const GAME_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
} as const;
