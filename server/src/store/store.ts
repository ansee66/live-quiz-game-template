import type { Player, Game, User } from '../types';

export const players = new Map<string, Player>();
export const users = new Map<string, User>();
export const games = new Map<string, Game>();

export const gameCodeMap = new Map<string, string>();