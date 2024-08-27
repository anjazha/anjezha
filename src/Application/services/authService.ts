
import bcrypt from 'bcryptjs';


import { User } from "@/Domain/entities/User";
import { IAuthService } from "../interfaces/User/IAuthRepository";
import { IUserRepository } from "../interfaces/User/IUserRepository";
import { generateToken, verifyToken } from "@/helpers/tokenHelpers";
import { sendMail } from '@/Infrastructure/mail/transportionMail';
import { BASE_URL } from '@/Config';




export class AuthService implements IAuthService {
    constructor(private userRepository: IUserRepository) {}


    async hasPass(pass:string, slats:number): Promise<string> {
        return await bcrypt.hash(pass, slats);
    }

    async register(user: User): Promise<User> {

        /* 1- Check if user exists
                3- Return user
                2- Insert user into database
                    4- Handle errors
                    5- Write tests
                    6- Refactor code
                    7- handle confirm password in express validaator 
                    */
        const {name, email, password, phoneNumber, profilePicture} = user; 

       
        //  1- Check if user exists 
        const userExist = await this.userRepository.findByEmail(email);

       // return error if exists
        if(userExist){
            throw new Error('User already exists');
        }

        // hash password
        user.password = await this.hasPass(password, 10);

        // create user
        const data = await this.userRepository.create(user)

        // return data to controller
        return data;
    }

    async login(email: string, password: string): Promise<string> {
        /* 1- find user by email
           2- checks email not found or not 
           3- return error if not found
           4- generate token if exists         
        */
       // 1- find user by email
        const user =  await this.userRepository.findByEmail(email);

      //  3- return error if not found
        if(!user){
            throw new Error('User not found');
        }

        if((await user).password !== password){
            throw new Error('Password is incorrect');
        }

      //  4- generate token if exists      
      
      const token = await generateToken({userId: user.id});

      return token;
        
    }



    async forgotPassword(email: string): Promise<void> {
        try{

            const user = await this.userRepository.findByEmail(email);

            if(!user){
                throw new Error('User not found');
            }

            // generate token
            const token = generateToken({userId: user.id});

            // send email with password reset link
            // service send email then calll
            const resetUrl = `${BASE_URL}/reset-password?token=${token}`;
            const html = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`;
            await sendMail(email, 'Password Reset', html);
        
        } catch(err){
            throw new Error('An error occurred');
        }
    }


    async resetPassword(token: string, newPassword: string): Promise<void> {
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            throw new Error('Invalid or expired token');
        }

        const user = await this.userRepository.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = this.hasPass(newPassword, 10);
        user.password = hashedPassword;

        await this.userRepository.update(user.id, user);

    }
    
    }

