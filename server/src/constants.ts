export const DEFAULT_PORT = 3000;

export const DEFAULT_SCORE = 0;

export const WS_MESSAGE_TYPES = {
  REG: 'reg',
  CREATE_GAME: 'create_game',
  JOIN_GAME: 'join_game',
  START_GAME: 'start_game',
  ANSWER: 'answer',
} as const;

export const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON',
  UNKNOWN_MESSAGE_TYPE: 'Unknown message type',
  INVALID_CREDENTIALS: 'Invalid credentials',
} as const;