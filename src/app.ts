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
    public port : number ;
    public app : Application;
    public server : Server;
    constructor(public readonly routes: Router[]){
        this.app = express()
        this.server = createServer(this.app)
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
            'http://localhost:3000',
            'http://localhost:5000', 
            'http://localhost:5173',
            'http://127.0.0.1:5173/'];

            const options: CorsOptions = {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
                credentials: true,
                allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
            };
            

          // preflight request // crendtails 
        this.app.use(cors(options))
        this.app.options('*', cors(options));
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(bodyParser.json({ type: 'application/json; charset=utf-8' }));
        this.app.use(express.urlencoded({extended: true}))


        // this.app.set('allow-access-contorl', 'https://e-learning-0wji.onrender.com/' )

       
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


 
 public listen() : void {

    this.server.listen(this.port, ()=>{
        console.log(`Server is running on port ${this.port}`); 
    })
    
    this.app.on('error', (error:any) => {
        console.error('Error occurred:', error);
        disconnectDB();
    });
 }

}


