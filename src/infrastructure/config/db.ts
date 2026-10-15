import { env } from '../../utils/env.js'
import mongoose from 'mongoose'


const mongoDburl =env.DB_URL
  
async function dbConnect(){
    try {
        
       const crr=await mongoose.connect(mongoDburl+"")

       console.log(crr.connection.host);
       
    } catch (error) {

        console.log(error);
        
    }
}

export default dbConnect