

import { User } from "@/Domain/entities/User";
import { IAuthService } from "../interfaces/User/IAuthRepository";
import { pgClient } from "@/Infrastructure/database";
import { UserRepository } from "./userRepository";



// export class AuthRepository implements IAuthService{
//     private client: any;
//     private userRepository: UserRepository;
//     constructor(){
//         this.client = pgClient;
//         this.userRepository = new UserRepository();
//     }


//     async register(user: User): Promise<User> {
//         /* 1- Check if user exists
//              3- Return user
//              2- Insert user into database
//                 4- Handle errors
//                 5- Write tests
//                 6- Refactor code
//                 7- handle confirm password in express validaator 
//                 */

//         const {name, email, password, phoneNumber, profilePicture} = user; 

       

//         const userExist = this.userRepository.findByEmail(email);

//         if(userExist){
//             throw new Error('User already exists');
//         }

//         const data = await this.userRepository.create(user)
//         return data;
       
//     }
  

//     async login(email: string, password: string): Promise<string> {

//         //login how do it ?? /**
//          /* 1. Check if user exists
//             * 2. Check if password is correct
//             * 3. Return success message
//             * 4. Return error message if user not found or password is incorrect
//             * 5. Handle errors
//             * 6. Write tests
//             * 7. Refactor code
//             * 8. Document code
//             * 9. Test again
//             * 10. Push to remote repository
//             * 11. Create pull request
//             * 12. Merge pull request
//             * 13. Deploy to production
//             * 14. Test in production
//             * 15. Celebrate
//             * 
//          */

//         const user = await this.userRepository.findByEmail(email);

//         if(!user){
//             throw new Error('User not found!');
//         }
     

//         if(user.password !== password){
//             throw new Error('Invalid password');
//         }

//         return 'Login successful';
//     }


//     async forgotPassword(email: string): Promise<void> {

//         //forgot password how do it ?? /**
//         /* 1. Check if user exists
//             * 2. Send email with reset password link
//             * 3. Return success message
//             * 4. Return error message if user not found
//             * 5. Handle errors
//             * 6. Write tests
//             * 7. Refactor code
//             * 8. Document code
//             * 9. Test again
//             * 10. Push to remote repository
//             * 11. Create pull request
//             * 12. Merge pull request
//             * 13. Deploy to production
//             * 14. Test in production
//             * 15. Celebrate
//             * 
//          */

//         const user = await this.userRepository.findByEmail(email);

//         if(!user){
//             throw new Error('User not found!');
//         }

//         // send email with reset password link



//     }


// };