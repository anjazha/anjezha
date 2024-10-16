import { Socket } from 'socket.io';
import { IOnlineUsersService } from '../interfaces/User/IOnlineUsersService';

class OnlineUsersService implements IOnlineUsersService{
  private static instance: OnlineUsersService;
  private onlineUsers: Map<string, string>;

  private constructor() {
    this.onlineUsers = new Map<string, string>();
  }

  public static getInstance(): OnlineUsersService {
   
    if(!OnlineUsersService.instance) 
         OnlineUsersService.instance = new OnlineUsersService();

    return OnlineUsersService.instance;
  }

  public addUser(userId: string, socketId:  string): void {
    this.onlineUsers.set(userId, socketId);
  }

  public removeUser(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  public getUserSocket(userId: string): string | undefined {
    return this.onlineUsers.get(userId);
  }

  public getAllUsers(): Map<string, string> {
    return this.onlineUsers;
  }
}

export default OnlineUsersService;
