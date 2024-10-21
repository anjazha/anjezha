import { UserRepository } from '@/Application/repositories/userRepository';
import { sendMail } from '@/Infrastructure/mail/transportionMail';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { HTTP500Error } from './ApiError';
import { safePromise } from './safePromise';

// Generate a random code


 class VerfiyEmail {

    constructor(public userRepository: UserRepository){
    }

     // generate code from 6 digit 
    async generateCode(length: number = 6): Promise<string> {
       return  crypto.randomBytes(Math.ceil(6 / 2)).toString('hex').slice(0, 6);
    }

    async  hashCode(code: string): Promise<string> {
        return crypto.createHash('sha256').update(code).digest('hex');
    }


    async storeVerificationCode(email: string, code: string): Promise<string> {
        const hashedCode = await this.hashCode(code);  // Optional hashing step
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 15); // 15-minute expiration
    
        // Save { email, hashedCode, expirationTime } to your database
        await this.userRepository.createVerificationCode(email,  hashedCode, expirationTime, new Date);

        
        return "code stored";
      }


  async verifyCode(email: string, inputCode: string): Promise<boolean> {

    const hashedInputCode = await this.hashCode(inputCode);

    const record = await this.userRepository.getVerificationCode(email, hashedInputCode ); 

    if (!record)  throw new HTTP500Error('code not valid or exipered'); 
     // No matching email found
    // if (new Date() > record.expiration_time) throw new HTTP500Error('code not valid'); // Code expired

    await this.updateCode(true, email, hashedInputCode);
    // set is_verfied=true
    return record;  // Check if codes match
  }


  async  handleEmailVerification(email: string) {

    const code = await this.generateCode();  // Step 1 generate code 
    // const [err, res] = await safePromise(()=> this.userRepository.findByEmail(email));

    // if(err) throw new HTTP500Error(err.message);
    // const id = res.id;

    // store verificationCode in db
    await this.storeVerificationCode(email, code);  // Step 2
    
   // Step 3 send mail to user with code 
    const mailOptions = {
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
    }

    await sendMail(mailOptions);
  }
  
   updateCode = async (status:boolean, email:string, hashCode:string ) => {

     const [error, result] =  await safePromise(()=> this.userRepository.updateConfirmation(status, email, hashCode));

      if(error) throw new HTTP500Error(error.message);

      return

  }
}

export const verfiyEmail = new VerfiyEmail(new UserRepository());

// verfiyEmail.handleEmailVerification(' ');
// verfiyEmail.generateCode();