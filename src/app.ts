import express, { Application } from "express";
import swaggerUi from  "swagger-ui-express";

import { errorHandler } from "./Presentation/middlewares/exceptions/errorHandler.middleware";
import { HTTP400Error, HTTP401Error } from "./helpers/ApiError";
import { EHttpStatusCode } from "./Application/interfaces/enums/EHttpStatusCode";
import {connectDB, disconnectDB} from '@/Infrastructure/database'
import { PORT,NODE_ENV } from "./Config";
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
    }

   private async initializeDbConnection(){ 
        await connectDB()
    }

  private initialzeMiddlewares(){

        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))


        this.app.use((err, req, res, next) => {
            
            if(NODE_ENV != 'production'){
                  errorHandler(new HTTP400Error(err.message), req, res, next)
            }  else{
                errorHandler(new HTTP400Error(`messsage:${err.message}\n stack:${err.stack}`), req, res, next)
            }
        })
       
  }

 private initializeRoutes(){


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