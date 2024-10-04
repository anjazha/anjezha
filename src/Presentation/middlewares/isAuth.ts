import { verifyToken } from '@/helpers/tokenHelpers';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface RequestWithUserId extends Request {
    userId?: undefined | Number;
}

const isAuth = (req: RequestWithUserId, res: Response, next: NextFunction) => {

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

            let decoded: string | JwtPayload;
            if(!token){
                return res.status(401).json({message: 'Unauthorized'});
            }

            // verify token
             decoded = verifyToken(token) as string | JwtPayload;

            // attach user to request object  // i am not can understand why show it error but it work
             const userId = Number(decoded.userId);

            req.userId =  Number(userId);

        //     // create role by default to user 
        //   const role = await this.roleRepository.createRole({name: 'user', userId: userId});
        //   console.log("role", role);

            next();

        }catch(error){
              next(error);
        }


}



export default isAuth;

// role based authorization
// validate user role
// check if user is authorized
// return error if user is not authorized