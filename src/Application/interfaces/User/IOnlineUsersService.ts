import OnlineUsersService from "@/Application/services/onlineUsersService";
import { Socket } from "socket.io";

export interface IOnlineUsersService {
  addUser(userId: string, socketId: string): void;
  removeUser(userId: string): void;
  getUserSocket(userId: string): string | undefined;
  getAllUsers(): Map<string, string>;
}
