import http from 'http';
import {Server as ServerSocketIO} from 'socket.io';
import {app} from './server';

class SocketIo{
    private io: any;
    private server: any;

    constructor(appi: any = ' '){
        this.server = http.createServer(app);

        this.io = new ServerSocketIO(this.server,{
            // cors: {
            //     origin: ["http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
            //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            //   }
        } )
    
        // this.io = require('socket.io')(this.server, {
        //     cors: {
        //         origin:[ "http://localhost:3000", "http://localhost:5000", "http://localhost:5173"],
        //         methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        //       }
        // });

    }

    async initializeSocket(){
        this.io.on('connection', (socket: any) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
     

    public listen(port: number){
        this.server.listen(port, ()=>{
            console.log(`Socket is running on port ${port}`)
        })
    }

    public getIO(){
        return this.io;
    }
}