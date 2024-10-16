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
import { decode } from "punycode";


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
        origin:'http://localhost:5173',
        methods: ["GET", "POST", 'PUT', 'DELETE'],
        credentials:true
      }
  });


  // Create a custom namespace '/chat'
  const chatNameSpace =  io.of('/chat');

  // hnadle authorization middleware
  io.use(async (socket, next) => {

   try{
    // console.log(socket.handshake)
    //  const {token} = socket.handshake.auth;
     const token : string | null = socket.handshake.headers?.token ? String(socket.handshake.headers?.token) : null;
    // console.log(token);
    
    if (!token) {
      console.log('token error!')
      return next(new HTTP500Error('Authentication error'));
    }
    
    const decoded =  verifyToken(token);

    //   console.log(decode)
    // console.log('decode', verifyToken(token));

    
    if (!decoded) {
       console.log('decoded error!')
       return next(new HTTP500Error('Authentication error'));
    }
    
    // store user data in socket
    socket.data.user = decoded as string | JwtPayload;    
    console.log('user', socket.data.user);

    
    next(); 

    } catch(err:any) {
       console.log('there`s error!'+ err.message);

        next(err);
  }
    // verfiy token is valid or not

  })

  // connection to server side
  io.on('connection', (socket : CustomSocket) => {
    
    // const userId = socket.data.userId || null;
    const {userId} = socket.data.user;
    socket.data.userId = userId;


    console.log('A user connected', userId);
    // session id or chat room id 
    // console.log(socket.id);
    // console.log(socket.handshake);
    // console.log(socket.rooms);
    socket.emit('message', JSON.stringify({ userId, message: 'Hello, world!' }));


    // message socket 
   
    // onlineUsers.addUser(String(userId), socket);

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
// check conversation exist or not 
// if conversation exist return conversationId 
// esle create new conversation and return id 
const startConversation =  (io:SocketServer, socket:DefaultSocket) => {

  socket.on('start-conversation', async (data : {senderId:number, receiverId:number}) =>{
    // console.log(senderId, receiverId)
    // check conversation exist or not 
     let conversationId;
     const [error, result] = await safePromise(()=> conversationRepository.checkConversationExist(data.senderId, data.receiverId));
    //  let conversationId;
    console.log(result);
    if(error){
        socket.emit('error', error.message);
    }

    // 1- if exist return id else create new conversation and return id to cleint also
    if(result)  conversationId = result.id;

    else {
      
        const [errConversation, resConversation] = await safePromise (
               () => conversationRepository.createConversation(
                       new Conversation(+data.senderId, +data.receiverId) ));

           if(errConversation) {
              socket.emit('error', 'Could not create or fetch conversation.');
              console.log(errConversation.message);
            }
            console.log(resConversation);
            conversationId = resConversation.conversationId;
          
    }

    console.log(conversationId);

    socket.emit('conversation-started', conversationId);

    
    // socket.join(conversationId); 

  })

  socket.on('join-conversation', (data: {conversationId :string})=>{
    console.log('join-conversation', data.conversationId);
    socket.join(String(data.conversationId));
  });

}


const messageSocket = (io:SocketServer, socket:DefaultSocket)=>{

     try{
      // extract user data from socket 
        const {user} = socket.data;
        const userId = Number(user.userId);

        
        // listen to client event called privateRoom

        // handle sendMessage from client to server 
        socket.on('send-message', async (data:any) =>{
      
            // extract message from data => {roomId, message, takerId}
           const {senderId, message, conversationId, receiverId} = data;
          // console.log

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
            socket.to(String(conversationId)).emit('receive-message', JSON.stringify(newMessage));
            // send message specify to receiver 
            socket.to(String(receiverId)).emit('receive-message', JSON.stringify(newMessage));
            // send message sepcify to sender
            socket.to(String(senderId)).emit('receive-message', JSON.stringify(newMessage));

          

            // update conversaation 
            await conversationRepository.updateConversation(+conversationId);

            // send notification to user
            await safePromise(() => notifNewMessage(io, socket, {message, recipientId: data.receiverId, conversationId}));
            //  notifNewMessage(io, socket);

        })

        // event on read message 


      } catch(err:any){
        console.log('there`s error!'+ err.message);
        socket.emit('error', JSON.stringify(`${err.message}`));
     }

}


const notifNewMessage= async (io:SocketServer, socket:DefaultSocket, {
  message,
  recipientId,
  conversationId,
  // role
}:any) => {
  // console.log(message , recipientId, conversationId);
  const userId = socket.data.userId || null;

  // const message = socket.data.message || null;
  // const recipientId =  socket.data.recipientId || null;
  // const roomId = socket.data.roomId || null;
  // const role = socket.data.user.role || null;
  // check if user is online or not 
  const recipientSocket = onlineUsers.getUserSocket(recipientId);
  if(recipientSocket){
    // send notification to user
    socket.to(String(recipientSocket.id)).emit('notfiy-new-message',(message));

  }  else {
      // type NotificationType 
       notificationService.sendNotification(new Notification(recipientId, message, ENOTIFICATION_TYPES.DEFAULT, false, new Date()));
      //  const recipientEmail = 'tahashabaan48@gmail.com' 
   

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