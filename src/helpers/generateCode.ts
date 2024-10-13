import { sendMail } from '@/Infrastructure/mail/transportionMail';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a random code
function generateVerificationCode(length: number = 6): string {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')  // Convert to hexadecimal
    .slice(0, length); // Trim to desired length
}

// Hash the code 
function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// Store code in the database with expiration time (pseudo code)
async function storeVerificationCode(email: string, code: string) {
  const hashedCode = hashCode(code);  // Optional hashing step
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 15); // 15-minute expiration

  // Save { email, hashedCode, expirationTime } to your database
  // Example: await database.save({ email, hashedCode, expirationTime });
}

// Send email with verification code (using nodemailer for example)
async function sendVerificationEmail(email: string, code: string) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com',
//       pass: 'your-email-password',
//     },
//   });

  const mailOptions = {
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is: ${code}. It will expire in 15 minutes.`,
  };

  await sendMail(mailOptions);
}

// Verify code function
async function verifyCode(email: string, inputCode: string, database:any): Promise<boolean> {
//   Fetch the stored code ?and expiration time from your database (pseudo code)
  const record = await database.getByEmail(email); 

  if (!record) return false;  // No matching email found
  if (new Date() > record.expirationTime) return false; // Code expired

  const hashedInputCode = hashCode(inputCode);
  return hashedInputCode === record.hashedCode;  // Check if codes match
}

// Example usage
async function handleEmailVerification(email: string) {
  const code = generateVerificationCode();  // Step 1
  await storeVerificationCode(email, code);  // Step 2
  await sendVerificationEmail(email, code);  // Step 3
}
