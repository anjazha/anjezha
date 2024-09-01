import dotenv from 'dotenv';



 dotenv.config({ path: `.env.${process.env.NODE_ENV|| 'development'}.local` }); 

// first way to export the config object
// export default {
//   port: process.env.PORT || 3000,
//   db: {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER|| 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'anjazha',
//     },
//     secret: process.env.TZ_SECRET || 'secret',
//     expiresIn: process.env.TZ_EXPIRES_IN || '1h',
//     bcryptSalt: process.env.TZ_BCRYPT_SALT || 10,
//     jwtSecret: process.env.TZ_JWT_SECRET
//     };


    // the second way to export the config object
 export const {
       BASE_URL,
        PORT,
        NODE_ENV,
        LOG_LEVEL,
        DB_URL,
        DB_PORT,
        DB_HOST,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        DB_CA,
       JWT_SECRET,
       JWT_EXPIRES_IN,
       JWT_BCRYPT_SALT,
       JWT_JWT_SECRET,
       EMAIL_HOST,
       EMAIL_PORT,
       EMAIL_USER,
       EMAIL_PASS  }  = process.env;


//



