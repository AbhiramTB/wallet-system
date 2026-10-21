import { env } from "../../utils/env.js";
import { Sequelize } from "sequelize";

let sequelize: Sequelize;

async function dbConnect(): Promise<Sequelize> {
 if(!env.DB_PASSWORD||!env.DB_USERNAME||!env.DB_HOST){
  throw new Error("db password and user db Host name required ")
 }

  try {
     sequelize = new Sequelize('wallet_system',env.DB_USERNAME,env.DB_PASSWORD,{

      dialect:"mysql",
      host:env.DB_HOST

    })
  
     sequelize.authenticate();
     console.log("MySQL‼️ database connected successfully");

  return sequelize
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export {sequelize}
export default dbConnect;
