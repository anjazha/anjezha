import { Socket } from 'socket.io';
import { IOnlineUsersService } from '../interfaces/User/IOnlineUsersService';

class OnlineUsersService implements IOnlineUsersService{
  private static instance: OnlineUsersService;
  private onlineUsers: Map<string, Socket>;

  private constructor() {
    this.onlineUsers = new Map<string, Socket>();
  }

  public static getInstance(): OnlineUsersService {
   
    if(!OnlineUsersService.instance) 
         OnlineUsersService.instance = new OnlineUsersService();

    return OnlineUsersService.instance;
  }

  public addUser(userId: string, socket: Socket): void {
    this.onlineUsers.set(userId, socket);
  }

  public removeUser(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  public getUserSocket(userId: string): Socket | undefined {
    return this.onlineUsers.get(userId);
  }

  public getAllUsers(): Map<string, Socket> {
    return this.onlineUsers;
  }
}

export default OnlineUsersService;
