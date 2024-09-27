import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUi from  "swagger-ui-express";
import morgan from "morgan"
import compression from "compression"
import cors, {CorsOptions} from 'cors'
import { errorHandler } from "./Presentation/middlewares/exceptions/errorHandler.middleware";
import { HTTP400Error, HTTP401Error } from "./helpers/ApiError";
import { EHttpStatusCode } from "./Application/interfaces/enums/EHttpStatusCode";
import {connectDB, disconnectDB} from '@/Infrastructure/database/index'
import { PORT, NODE_ENV } from "./Config/index";
import swaggerSpec from "./swager";
import { compare } from 'bcryptjs';
import { createServer, Server } from "http";



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
        this.initializeErrorHandler();
    }

   private async initializeDbConnection(){ 
        await connectDB()
    }

  private initialzeMiddlewares(){

    if (NODE_ENV === 'development') {
        this.app.use(morgan('dev'));
        console.log('morgan enabled')
    }
//    console.log(NODE_ENV)
// handle cors 
        const allowedOrigins = ['http://localhost:3000','http://localhost:5000','http://localhost:5173'];

        const options:CorsOptions = {
            origin: allowedOrigins,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            allowedHeaders: 'Content-Type,Authorization'
          };

          // preflight request
        this.app.use(cors(options))
        this.app.options('*', cors(options));
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))


        // this.app.set('allow-access-contorl', 'https://e-learning-0wji.onrender.com/' )

       
  }

  private initializeRoutes(){


    // homw route 
    this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
        res.status(200).json({message: 'Welcome to  Anjezha API:v1'})
    })


    this.routes.forEach(route => {
        this.app.use('/api/v1', route)
    })


// api to swager documentions 
    this.app.use('/api-docs',swaggerUi.serve,  swaggerUi.setup(swaggerSpec));

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