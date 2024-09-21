import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUi from  "swagger-ui-express";
import morgan from "morgan"
import compression from "compression"
import cors from 'cors'
import { errorHandler } from "./Presentation/middlewares/exceptions/errorHandler.middleware";
import { HTTP400Error, HTTP401Error } from "./helpers/ApiError";
import { EHttpStatusCode } from "./Application/interfaces/enums/EHttpStatusCode";
import {connectDB, disconnectDB} from '@/Infrastructure/database/index'
import { PORT, NODE_ENV } from "./Config/index";
import swaggerSpec from "./swager";
import { compare } from 'bcryptjs';



export class App {
    public port : number ;
    public app : Application
    constructor(public readonly routes: any[]){
        this.app = express()
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
        this.app.use(cors())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))

       
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


 public listen() : void {

    this.app.listen(this.port, ()=>{
        console.log(`Server is running on port ${this.port}`); 
    })
    
    this.app.on('error', (error:any) => {
        console.error('Error occurred:', error);
        disconnectDB();
    });
 }

}