// import http from 'http';
// import {Server as ServerSocketIO} from 'socket.io';
// import {app, server} from './server';

// class SocketIo{
//     private io: any;
//     // private server: any;

//     constructor(appi: any = ' '){
//         // this.server = http.createServer(app);

//         this.io = new ServerSocketIO(server,{
//             cors: {
//                 origin:'*',
//                 methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//                 // Credential:true
//               }
//         } )

//     }

//     // async initializeSocket(){
//     //     this.io.on('connection', (socket: any) => {
//     //         console.log('a user connected');

//     //         socket.on('chat message', (mesg:string)=>{
//     //             this.io.emit('message', mesg)
//     //         })
//     //         socket.on('disconnect', () => {
//     //             console.log('user disconnected');
//     //         });
//     //     });
//     // }


//     async initializeSocket(){

//         this.io.on('connection', (socket:any)=>{
//             try{

//                 if (!socket.request.user) socket.disconnect();

    
//                 socket.on('disconnect', ()=>{
//                     console.log('user is  disconnect')
//                 })
//               } catch(err){

//               }

//         })

//     }
     


//     // public static getInstance(httpServer: http.Server): ServerSocketIO {
//     //     if (!ServerSocketIO.instance) {
//     //         ServerSocketIO.instance = new ServerSocketIO(httpServer);
//     //     }
//     //     return ServerSocketIO.instance;
//     //   }
   

//     public getIO(){
//         return this.io;
//     }

//     public closeSocket(): void {
//         this.io.close();
//       }

//       public getConnectedUsers(): number {
//         return Object.keys(this.io.sockets.sockets).length;
//       }
    
    


// }