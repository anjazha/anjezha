import {Server as SocketServer, Socket as DefaultSocket } from "socket.io"
import {Server} from "http"
import OnlineUsersService from "@/Application/services/onlineUsersService";
import { HTTP500Error } from "@/helpers/ApiError";
import { verifyToken } from "@/helpers/tokenHelpers";
// import { Socket as DefaultSocket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";


import { Message, MessageStatus } from "@/Domain/entities/Message";
import { safePromise } from "@/helpers/safePromise";
import { ConversationService } from "@/Application/services/conversationService";
import { ConversationRepository } from "@/Application/repositories/conversationRepository";
import { MessageRepository } from "@/Application/repositories/messageRepository";
import { Conversation } from "@/Domain/entities/Conversation";
import { MessageService } from "@/Application/services/messageService";
import { sendMail } from "../mail/transportionMail";


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

    console.log('A user connected', userId);
    // session id or chat room id 
    console.log(socket.id);
    // console.log(socket.handshake);
    console.log(socket.rooms);

    // message socket 
   

    // lsiten from client event called `add_user`
    socket?.on('add_user', (userId : string) => {
      console.log(userId);
      // set userId in socket 
        socket.data.userId = userId;
        // store userid in onlines users 
        onlineUsers.addUser(userId, socket);

        // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
    })
    // get online uses 
    socket.emit('online_users', [...onlineUsers.getAllUsers()])

    // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)

    // handle message socket
    if(io) messageSocket(io, socket);

    // handle notification socket when send message

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
        const userId = Number(user.userId);
        
        // listen to client event called privateRoom
        socket.on('private_room', async (takerId:number) =>{

          const roomId = generateRoomId(userId, takerId);
          // create room by user id 

          socket.join(roomId);

          // store conversation in db
          const conversationService = new ConversationService(new ConversationRepository());

          // used instead try... catch
          const [error, result] = await safePromise(()=> {
            return conversationService.createConversation(new Conversation(userId, takerId, new Date(), Math.abs(+roomId)));
          })

          if(error){
            console.log(error);
          }

          // console.log(`User joined conversation: ${user.userId}`);
        // }

          // create room by user id in db
          console.log(`User joined conversation: ${userId}`);
        })


        // handle sendMessage from client to server 
        socket.on('private_message', async (data:any) =>{
      
            // extract message from data => {roomId, message, takerId}
            const {roomId, message} = data;

            // get receiver from conversation by roomId
            // await to save date in db
      
            enum messageType {
              SENT="SENT",
            } 
              const newMessage = new Message(userId, +roomId, message, MessageStatus.SENT , new Date());

              // awai to save it message in db
            // specifiy to one room called userId and sned it messsege 
            io.to(roomId).emit('receive_message', {userId, message, timestamp: new Date()});

            const messageService= new MessageService(new MessageRepository());

            // save message in db
            const [error, result] = await safePromise(() => {
              return messageService.createMessage(newMessage);
            })

            if(error){
              console.log(error);
            }
            
        


        })


     } catch(err:any){

     }

}


const notifNewMessage= (io:SocketServer, socket:DefaultSocket) => {

  const userId = socket.data.userId || null;

  const message = socket.data.message || null;
  const recipientId =  socket.data.recipientId || null;
  // check if user is online or not 
  const receiverSocket = onlineUsers.getUserSocket(recipientId);
  if(receiverSocket){
    // send notification to user
    io.to(String(receiverSocket.id)).emit('notify_new_message',(socket.data.messaage))
  }  else {
    const recipientEmail = getUserEmail(recipientId);  // Function to get user email
    sendMail(recipientEmail, message, '');

  }

  // if user is online send notification to user
  // if user is offline save notification in db', push in web or send to email
  
  }
export const getSocket = () => {
  if(!io) throw new Error('Socket.io not initialized');
  return io;
}