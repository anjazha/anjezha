// configuration with database connect
import pg, { ClientConfig } from 'pg';

import { DB_HOST,DB_PASSWORD,DB_USER,DB_NAME, DB_CA, DB_PORT } from '@/Config';

// console.log(PORT, DB_HOST,DB_PASSWORD,DB_USER,DB_NAME, DB_CA, DB_PORT)
// const config:ClientConfig = {
//     user: DB_USER,
//     password: DB_PASSWORD,
//     host: DB_HOST,
//     port: DB_PORT ? parseInt(DB_PORT, 10) : undefined, // Convert DB_PORT to number or assign undefined
//     database: DB_NAME,
//     // ssl:false
//     ssl: {
//         rejectUnauthorized: true,
//         ca: DB_CA,
//     },
// };

// const client = new pg.Client(config);




const config = {
    user: DB_USER,
    password:DB_PASSWORD ,
    host:DB_HOST ,
    port: Number(DB_PORT),
    database:DB_NAME ,
    ssl: {
        rejectUnauthorized: true,
        ca: DB_CA,
    },
};

const client = new pg.Client(config);


const connectDB = async () => {
    try {
        await client.connect();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error', error);
    }
}

const disconnectDB = async () => {
    try {
        await client.end();
        console.log('Database disconnected');
    } catch (error) {
        console.error('Database disconnection error', error);
    }
}


export { client as pgClient, connectDB, disconnectDB };
// client.connect(function (err) {
//     if (err)
//         throw err;
//     client.query("SELECT VERSION()", [], function (err, result) {
//         if (err)
//             throw err;

//         console.log(result.rows[0].version);
//         client.end(function (err) {
//             if (err)
//                 throw err;
//         });
//     });
// });