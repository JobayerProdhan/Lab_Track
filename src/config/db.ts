
import  dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
    connectionString:process.env.DATABASE_URL,ssl:{
        rejectUnauthorized:false,
    },
});

// TEST DATABASE CONNECTION 
export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Databse connected successfully');

        client.release();  
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit(1);
        
    }
}
