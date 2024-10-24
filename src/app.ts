import express, { Application, NextFunction, Request, Response, Router } from "express";
import swaggerUi from  "swagger-ui-express";
import morgan from "morgan"
import compression from "compression"
import cors, {CorsOptions} from 'cors'
import bodyParser from 'body-parser';
import { createServer, Server } from "http";
import { errorHandler } from "./Presentation/middlewares/exceptions/errorHandler.middleware";
import {connectDB, disconnectDB} from '@/Infrastructure/database/index'
import { PORT, NODE_ENV } from "./Config/index";
import swaggerSpec from "./swager";
import { io, setupSocket } from "./Infrastructure/socket/cofigureSocket";
import { HTTP404Error } from "./helpers/ApiError";
import { isAuth } from "./Presentation/middlewares/isAuth";



export class App {
    private port : number ;
    private app : Application;
    private server: Server;
    constructor(public readonly routes: any[]){
        this.app = express();
        this.server= createServer(this.app);
       // console.log(this.app);
        this.port = Number(PORT) || 5000;
        this.initializeDbConnection()
        this.initialzeMiddlewares()
        this.initializeRoutes()
        this.initializeSocket()
        this.initializeErrorHandler();
    }

   private async initializeDbConnection(){ 
        await connectDB()
    }

  private initialzeMiddlewares(): void{

    if (NODE_ENV === 'development') {
        this.app.use(morgan('dev'));
        console.log('morgan enabled')
    }

    // this.app.use(this.app.rest)
//    console.log(NODE_ENV)
// handle cors 
        const allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173/',
            'https://www.anjez.tech',
        ];

        const corsOptions: CorsOptions = {
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        };
            // handle 
            
        // this.app.use((req:Request, res:Response, next:NextFunction) => {
        //         res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
        //         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        //         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        //         next();
        //  });

          // preflight request // crendtails 
        this.app.use(cors(corsOptions))
        // this.app.options('*', cors(corsOptions));
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(bodyParser.json({ type: 'application/json; charset=utf-8' }));
        this.app.use(express.urlencoded({extended: true}))


       
  }

 private initializeRoutes() : void{


    // homw route 
    this.app.route('/').get((req:Request, res:Response, next:NextFunction) => {
        res.status(200).json({message: 'Welcome to  Anjezha API:aws2.1'})
    })


    this.routes.forEach(route => {
        this.app.use('/api/v1', route)
    })

// api to swager documentions 
    this.app.use('/api-docs',swaggerUi.serve,  swaggerUi.setup(swaggerSpec));

// unhandled routes
this.app.use('*', (req:Request, res:Response, next:NextFunction) => {
    next(new HTTP404Error(`${req.path} route not found`))
} )

 }

 private initializeSocket() : void {
    console.log('intial socket')
    setupSocket(this.server)
    
    // io?.use((socket, next) => {
    //     const req = socket.request as express.Request;
    //     const userId = req.userId;
    //     socket.data.userId = userId;
    //     next()

    // })
 }

 private initializeErrorHandler() : void { 
    this.app.use(errorHandler)
 }

 private async swagerRoute(){
    this.app.use('/api-docs',swaggerUi.serve,  swaggerUi.setup(swaggerSpec));
 }

  public getExpressApp(): Application {
    return this.app;
  }

  public getServer(){
    return this.server;
  }

 
 public listen() : void {
     this.server.listen(this.port, () => {
        console.log("app is running on port " + this.port);
     })

     this.app.on('error', (err) => {
        console.error('server error', err);
      }
    );
}



}


