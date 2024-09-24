import {Server as SocketServer, Socket} from "socket.io"
import {Server} from "http"
import OnlineUsersService from "@/Application/services/onlineUsersService";

const onlineUsers = OnlineUsersService.getInstance();

export let  io : SocketServer | null = null;

export const  setupSocket = (server : Server) : void =>{
  io = new SocketServer(server);
  io.on('connection', (socket : Socket) => {
    const userId = socket.data.userId || null;
    console.log(userId)
    socket?.on('add_user', (userId : string) => {
        socket.data.userId = userId;
        onlineUsers.addUser(userId, socket);
        console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
    })

    // onlineUsers.addUser(userId, socket);
    // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)

    socket.on('disconnect', () => {
        console.log(socket)
        onlineUsers.removeUser(socket.data.userId);
        console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
      console.log('A user disconnected');
    });
  });
}


