import OnlineUsersService from "@/Application/services/onlineUsersService";
import { Socket } from "socket.io";

export interface IOnlineUsersService {
  addUser(userId: string, socket: Socket): void;
  removeUser(userId: string): void;
  getUserSocket(userId: string): Socket | undefined;
  getAllUsers(): Map<string, Socket>;
}
