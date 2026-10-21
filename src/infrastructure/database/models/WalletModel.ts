
import type { WalletStatus } from "../../../domain/entities/Wallet.js";
import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { UserModel } from "./UserModel.js";
import { sequelize } from "../../config/db.js";

export interface WalletPersistence {
  id:number;
  userId:number;
  balance: number;
  currency: string;
  preferredCurrency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}



 class WalletModel extends Model< InferAttributes<WalletModel>,InferCreationAttributes<WalletModel> > {
   declare id:CreationOptional<number>;
  declare userId:number;
  declare balance: number;
  declare currency: string;
  declare preferredCurrency: string;
  declare status: WalletStatus;
  declare createdAt: CreationOptional<Date>;
 declare  updatedAt: CreationOptional<Date>;
}

WalletModel.init({

 id:{
   type:DataTypes.INTEGER,
   primaryKey:true,
   autoIncrement:true
 },
 userId:{
  type:DataTypes.INTEGER,
  allowNull:false,
  references:{
   model:UserModel ,
   key:"id"
  },
  unique:true,

 },
 balance:{
  type: DataTypes.DECIMAL(15, 2),
  defaultValue: 0,
 },
 currency:{
    type:DataTypes.STRING(10),
    defaultValue:"INR"
 },

preferredCurrency:{
    type:DataTypes.STRING(10),
    defaultValue:"INR"

}
,
status:{
  type:DataTypes.ENUM("active", "inactive", "frozen", "closed"),
  defaultValue:'active'
},

createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
},
updatedAt: {
  type: DataTypes.DATE,
  allowNull: false,
},

},

{
  sequelize,
  tableName:"Wallet",
  timestamps:true
}


)



export {WalletModel}







