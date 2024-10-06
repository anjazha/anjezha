function generateRoomId(userId1:number, userId2:number):string {
  return `${Math.min(userId1, userId2)}-${Math.max(userId1, userId2)}`;
}