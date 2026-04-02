export const ID_LENGTH = 12;
export const ROOM_CODE_LENGTH = 6;

export const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export function generateId(): string {
  return generateCode(ID_LENGTH);
}

export function generateRoomCode(): string {
  return generateCode(ROOM_CODE_LENGTH);
}