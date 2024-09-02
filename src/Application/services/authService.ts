

import { hasPass, comparePass } from '@/helpers/bcryptHelper';

import { User } from "@/Domain/entities/User";
import { IAuthService } from "../interfaces/User/IAuthService";
import { IUserRepository } from "../interfaces/User/IUserRepository";
import { generateToken, verifyToken } from "@/helpers/tokenHelpers";
import { sendMail } from '@/Infrastructure/mail/transportionMail';
import { BASE_URL } from '@/Config';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '@/helpers';
import { hashCode } from '@/helpers/hashCode';
import { IRoleRepository } from '../interfaces/User/IRoleRepository';
import { Role } from '@/Domain/entities/role';



@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(INTERFACE_TYPE.UserRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.RoleRepository) private roleRepository: IRoleRepository   
    ) {}

    async register(user: User): Promise<User> {

        /* 1- Check if user exists
                3- Return user
                2- Insert user into database
                    4- Handle errors
                    5- Write tests
                    6- Refactor code
                    7- handle confirm password in express validaator 
                    */
        try{
        const {email, password} = user; 

       
        //  1- Check if user exists 
        const userExist = await this.userRepository.findByEmail(email);

        console.log("userexist" , userExist);

       // return error if exists  1- handle unit test 1
        if(userExist){
            throw new Error('User already exists');
        }

        // hash password  // 2- handle unit test 2
         user.password = await hasPass(password, 10);

         // create user  // handle unit test 3
           const data = await this.userRepository.create(user);

          

        // return data to controller
          return data;
         } 
          catch(err){  
              throw new Error('An error occurred' + err); 
         }
    }

    async login(email: string, password: string): Promise<string> {
        /* 1- find user by email
           2- checks email not found or not 
           3- return error if not found
           4- generate token if exists         
        */
       // 1- find user by email
        const user =  await this.userRepository.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }
        // create role to user
        
        // check password  // handle unit test 5
        if(!await comparePass(password, user.password)){
            throw new Error('Password is incorrect');
        }

       
      //   console.log("userId", user.id);
      // check on  it user exist roles or not
    let role = await this.roleRepository.getRoleByUserId(user.id);

     if(!role){
          role= await this.roleRepository.createRole( new Role(user.id, 'user')); 
     }

        
      //  4- generate token if exists       // handle unit test 6
      const token =  generateToken({userId: (user.id), role:role.name});

      return token;
        
    }

    async forgotPassword(email: string): Promise<void> {
        try{

            const user = await this.userRepository.findByEmail(email);

            // if(!user){
            //     throw new Error('User not found');
            // }

            // generate token
            const token = await generateToken({userId: user.id});

            //   const passwordRecoveryCode = hashCode()
            // send email with password reset link
            // service send email then calll
            const resetUrl = `${BASE_URL}/auth/reset-password/${token}`;
            // console.log(BASE_URL)
            const html = `<div><h3>You requested a password reset.<h3/> <p> Click <a href="${resetUrl}">here</a> to reset your password.</p><div/>`;

            await sendMail(email, 'Reset Password', html);
            console.log('Email sent');
        
        } catch(err){
            throw new Error('An error occurred' + err.message + err.stack);
        }
    }


     async resetPassword(tokenRest: string, newPassword: string): Promise<string> {
        let decoded;
        try {
            // verify token
            decoded = await verifyToken(tokenRest);
          } catch (err) {
            throw new Error('Invalid or expired token');
          }

            const user = await this.userRepository.findById(decoded.userId);
            
            // check if user exists   // handle unit test 7
            if (!user) {
                throw new Error('User not found');
            }
            
            const hashedPassword = await hasPass(newPassword, 10);
            user.password = hashedPassword;
            
            await this.userRepository.update(user.id, user);

            // generate new token  to login
            // const token = await generateToken({userId: user.id});
            // return token;

            return "Password reset successfully";
    }
    

}