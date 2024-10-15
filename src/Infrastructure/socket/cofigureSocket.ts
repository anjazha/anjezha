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
import { TaskerService } from "@/Application/services/taskerService";
import { TaskerRepository } from "@/Application/repositories/taskerRepository";
import { UserService } from "@/Application/services/userService";
import { UserRepository } from "@/Application/repositories/userRepository";
import { error } from "console";
import { NotificationService } from "@/Application/services/notificationService";
import { ENOTIFICATION_TYPES } from "@/Application/interfaces/enums/ENotificationTypes";
import { NotificationRepository } from "@/Application/repositories/notificationRepository";
import { Notification } from "@/Domain/entities/Notification";


interface CustomSocket extends DefaultSocket {
  user?: string | JwtPayload;
}


// declare module "socket.io" {
//   interface Socket extends CustomSocket {}
// }

const onlineUsers = OnlineUsersService.getInstance();

const notificationService = new NotificationService(
  new NotificationRepository(),
  onlineUsers
);

const conversationRepository = new ConversationRepository();
const messageRepository= new MessageRepository();

export let  io : SocketServer | null = null;

export const  setupSocket = (server : Server) : void =>{

  io = new SocketServer(server, {
     cors: {
        origin:'*',
        methods: ["GET", "POST", 'PUT', 'DELETE'],
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
    
    // const userId = socket.data.userId || null;
    const userId = socket.data.user.id;
    socket.data.userId = userId;


    console.log('A user connected', userId);
    // session id or chat room id 
    console.log(socket.id);
    // console.log(socket.handshake);
    console.log(socket.rooms);

    // message socket 
   
    onlineUsers.addUser(String(userId), socket);
    // lsiten from client event called `add_user`
    // socket?.on('add_user', (userId : string) => {
    //   console.log(userId);
    //   // set userId in socket 
    //     socket.data.userId = userId;
    //     // store userid in onlines users 
    //     onlineUsers.addUser(userId, socket);

    //     // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)
    // })
    // get online uses 
    socket.emit('online-users', [...onlineUsers.getAllUsers()])

    // console.log(`online users ${[...onlineUsers.getAllUsers()]}`)

    // create conversation to (sender, receiver )
     if (io) startConversation(io, socket);
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


// start conversation by conversation id 

const startConversation =  (io:SocketServer, socket:DefaultSocket) => {
  io.on('start-conversation', async (senderId:number, receiverId:number) =>{
    // check conversation exist or not 
     let conversationId;
     const [error, result] = await safePromise(()=> conversationRepository.checkConversationExist(senderId, receiverId));
    //  let conversationId;

    // if(error){
    //     socket.emit('error', error.message);
    // }

    // 1- if exist return id else create new conversation and return id to cleint also
    if(result)  conversationId = result.id;

    else {

        const [errConversation, resConversation] = await safePromise (
               () => conversationRepository.createConversation(
                       new Conversation(+senderId, +receiverId) ));

            if(errConversation) {
              socket.emit('error', 'Could not create or fetch conversation.');
              console.log(errConversation.message);
            }

            conversationId = resConversation.conversationId;
    }

    socket.emit('conversation-started', conversationId);

    socket.on('join-conversation', (conversationId :string)=>{
      console.log('join-conversation', conversationId);
      socket.join(String(conversationId));
    });

    // socket.join(conversationId);

  })
}


const messageSocket = (io:SocketServer, socket:DefaultSocket)=>{

     try{
      // extract user data from socket 
        const {user} = socket.data;
        const userId = Number(user.userId);

        
        // listen to client event called privateRoom

        // handle sendMessage from client to server 
        socket.on('send-message', async (data:Message) =>{
      
            // extract message from data => {roomId, message, takerId}
           const {senderId, message, conversationId} = data;


            // get receiver from conversation by roomId
            // await to save date in db
      
            enum messageType {
              SENT="SENT",
            } 
              const newMessage = new Message(senderId, conversationId, message, MessageStatus.SENT , new Date());

              // awai to save it message in db
              const [error, result] = await safePromise(() => {
                return messageRepository.createMessage(newMessage);
              })
  
              if(error){
                console.log(error.messaage);
                //  throw new HTTP500Error('something went wrong!'+ error.messaage);
                socket.emit('error', 'Could not send message.');

              }
            // specifiy to one room called userId and sned it messsege 
            io.to(String(conversationId)).emit('receive-message', newMessage);

            // update conversaation 
            await conversationRepository.updateConversation(+conversationId);

             await safePromise(() => notifNewMessage(io, socket));
            // send notification to user
            //  notifNewMessage(io, socket);
            
        })

      } catch(err:any){
        console.log('there`s error!'+ err.message);
        socket.emit('error', `${err.message}`);
     }

}


const notifNewMessage= async (io:SocketServer, socket:DefaultSocket, {
  message,
  recipientId,
  conversationId,
  role
}:any) => {

  const userId = socket.data.userId || null;

  // const message = socket.data.message || null;
  // const recipientId =  socket.data.recipientId || null;
  // const roomId = socket.data.roomId || null;
  // const role = socket.data.user.role || null;
  // check if user is online or not 
  const recipientSocket = onlineUsers.getUserSocket(recipientId);
  if(recipientSocket){
    // send notification to user
    io.to(String(recipientSocket.id)).emit('notfiy-new-message',(message));
  }  else {

      // type NotificationType 
       notificationService.sendNotification(new Notification(recipientId, message, ENOTIFICATION_TYPES.DEFAULT, false));
    
       const recipientEmail = 'tahashabaan48@gmail.com' 
   
       
       // send email to user if offline
      //  sendMail(recipientEmail, message, '');

    }

  }

  // if user is online send notification to user
  // if user is offline save notification in db', 
  // push in web or send to email
  
  

  
export const getSocket = () => {
  if(!io) throw new Error('Socket.io not initialized');
  return io;
}