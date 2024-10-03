export function getRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].join("_");
  }

