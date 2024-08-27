import { verifyToken } from '@/helpers/tokenHelpers';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUserId extends Request {
    userId?: string;
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

            if(!token){
                return res.status(401).json({message: 'Unauthorized'});
            }

            // verify token
            const decoded = verifyToken(token);

            // attach user to request object

            req.userId = decoded.userId;

            next();

        }catch(error){
                 res.status(401).json({message: 'Unauthorized'});
        }


}



export default isAuth;

// role based authorization
// validate user role
// check if user is authorized
// return error if user is not authorized