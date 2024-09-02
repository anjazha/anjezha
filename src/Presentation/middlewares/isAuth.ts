import RequestWithUserId from '@/Application/interfaces/Request';
import { HTTP401Error, HTTP500Error } from '@/helpers/ApiError';
import { verifyToken } from '@/helpers/tokenHelpers';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// interface RequestWithUserId extends Request {
//     userId?: string | Number;
// }

export const isAuth = (req: RequestWithUserId, res: Response, next: NextFunction) => {

    /*
     1- Check if user is authenticated
        2- Check if user is authorized
        3- Return error if user is not authenticated
        4- Return error if user is not authorized
        5- Handle errors
        6- Write tests*/
        
        try{
            const token = req.headers.authorization?.split(' ')[1];
    
            // console.log(token)

            if(!token){
                return res.status(401).json({message: 'Unauthorized'});
            }

            // verify token
            const decoded = verifyToken(token) as string | JwtPayload;

            // attach user to request object  // i am not can understand why show it error but it work
            const {userId, role} = (decoded as JwtPayload);

            // const role = decoded.role;

            req.userId =  Number(userId);

            req.role = role;

        //     // create role by default to user 
        //   const role = await this.roleRepository.createRole({name: 'user', userId: userId});
        //   console.log("role", role);

            next();

        }catch(error){
              next(error);
        }


}


export const alllowTo = (...roles: string[]) => {
     return (req: RequestWithUserId, res: Response, next: NextFunction) => {
        // check if user is authorized
        // return error if user is not authorized
        // validate user role
        // check if user is authorized
        // return error if user is not authorized
        try{
            if(!roles.includes(req.role)){
                next(new HTTP401Error('not alllow to access this route'));
            }
            next();
        }catch(error){
            next(error);
        }

     }

}


// export default isAuth;

// role based authorization
// validate user role
// check if user is authorized
// return error if user is not authorized