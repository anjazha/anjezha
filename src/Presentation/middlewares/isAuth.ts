import { verifyToken } from '@/helpers/tokenHelpers';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUserId } from '@/Application/interfaces/IRequestWithUserId';
import { HTTP401Error } from '@/helpers/ApiError';


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
            if(!token){
                // return res.status(401).json({message: 'Unauthorized'});
                return next(new HTTP401Error());
            }

            // verify token
            const decoded = verifyToken(token);

            // attach user to request object

            req.userId = decoded.userId;

            next();

        }catch(error){
                // console.log(error);
                //  res.status(401).json({message: 'Unauthorized'});
                next(new HTTP401Error(error.message))
        }


}



export default isAuth;

// role based authorization
// validate user role
// check if user is authorized
// return error if user is not authorized