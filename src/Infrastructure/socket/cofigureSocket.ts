import {Server as SocketServer, Socket as DefaultSocket } from "socket.io"
import {Server} from "http"
import OnlineUsersService from "@/Application/services/onlineUsersService";
import { HTTP500Error } from "@/helpers/ApiError";
import { verifyToken } from "@/helpers/tokenHelpers";
// import { Socket as DefaultSocket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";
import { Socket } from "dgram";


interface CustomSocket extends DefaultSocket {
  user?: string | JwtPayload;
}


// declare module "socket.io" {
//   interface Socket extends CustomSocket {}
// }

const onlineUsers = OnlineUsersService.getInstance();

export let  io : SocketServer | null = null;

export const  setupSocket = (server : Server) : void =>{

  io = new SocketServer(server, {
     cors: {
        origin:'*',
        methods: ["GET", "POST"],
        // Credential:true
      }
  });


  // Create a custom namespace '/chat'
  const chatNameSpace =  io.of('/chat');

  // hnadle authorization middleware
  io.use(async (socket, next) => {

   try{
     const {token} = socket.handshake.auth;
    
    // console.log(token);
    
    if (!token) {
      console.log('token error!')
      return (new HTTP500Error('Authentication error'));
    }
    
    const decoded =  verifyToken(token);

    // console.log('decode', verifyToken(token));
    
    if (!decoded) {
       console.log('decoded error!')
       return (new HTTP500Error('Authentication error'));
    }
    
    // store user data in socket
    socket.data.user = decoded as string | JwtPayload;    
    console.log('user', socket.data.user);
    
    next(); 

    } catch(err:any) {
       console.log('there`s error!'+ err.message);


        return new HTTP500Error(`${err.message}`);
  }
    // verfiy token is valid or not

  })

  // connection to server side
  io.on('connection', (socket : CustomSocket) => {
    
    const userId = socket.data.userId || null;
    // session id or chat room id 
    console.log(socket.id);
    // console.log(socket.handshake);
    console.log(socket.rooms);

    // lsiten from client event called `add_user`
    socket?.on('add_user', (userId : string) => {
      console.log(userId);
      // set userId in socket 
        socket.data.userId = userId;
        // store userid in onlines users 
        onlineUsers.addUser(userId, socket);

        // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
    })

    // onlineUsers.addUser(userId, socket);
    // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)

    socket.on('disconnect', () => {
        // console.log(socket)
        onlineUsers.removeUser(socket.data.userId);
        // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
      console.log('A user disconnected');
    });
  });
}


const messageSocket = (io:SocketServer, socket:DefaultSocket)=>{

     try{
      // extract user data from socket 
        const {user} = socket.data;

        // listen to client event called privateRoom
        socket.on('joinRoom', () =>{
          // create room by user id 
          socket.join(user.userId);
          console.log(`User joined conversation: ${user.userId}`);
        })

        // handle sendMessage from client to server 
        socket.on('sendMessage', (message:any)=>{
          try{

            // await to save message in message table 
              
            // specifiy to one room called userId and sned it messsege 
            io.to(user.userId).emit('newMessage', message);
            
          }catch(err:any){

          }

          
        })


     } catch(err:any){

     }

}


