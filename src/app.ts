import express, { Application } from "express";
import swaggerUi from  "swagger-ui-express";

import { errorHandler } from "./Presentation/middlewares/exceptions/errorHandler.middleware";
import { HTTP400Error } from "./helpers/ApiError";
import { EHttpStatusCode } from "./Application/interfaces/enums/EHttpStatusCode";
import {connectDB, disconnectDB} from '@/Infrastructure/database'
import { PORT } from "@/Config";
import swaggerSpec from "./swager";


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
        this.connectDb()
    }

   private initializeDbConnection(){

    }

  private initialzeMiddlewares(){}

 private initializeRoutes(){


    this.routes.forEach(route => {
        this.app.use('/api/v1', route)
    })

    this.app.get('/api', (req, res, next)=>{
        next(new HTTP400Error("this is bad request"))
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

  private async connectDb() {
    await connectDB();
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