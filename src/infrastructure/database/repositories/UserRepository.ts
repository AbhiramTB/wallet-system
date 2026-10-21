import { injectable } from "tsyringe";

import type { CreateUserInput, User } from "../../../domain/entities/User.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";

import { UserModel, type UserPersistence } from "../models/UserModel.js";      
import { Transaction } from "sequelize";



function toUser(document:UserPersistence ): User {
  return {
    id: document.id.toString(),
    username: document.username,
    email: document.email,
    password: document.password,
    createdAt: document.createdAt,
  };
}

@injectable()

export class UserRepository implements IUserRepository {
  constructor(private readonly session: Transaction ) {}

  
  async save(user:CreateUserInput):Promise<User>{
   const newuser=await UserModel.create({
      email:user.email,
      password:user.password,
      username:user.username
    },{
    transaction: this.session
    })
   
    return toUser(newuser)
  }


  async findById(id: string): Promise<User | null> {
    const userId = Number(id)

    const user = await  UserModel.findByPk(userId,{
      transaction:this.session
    });
     
     
    

    return  user?toUser(user):null
  }



  async findByEmail(email: string): Promise<User | null> {
     const user  =await UserModel.findOne({ 
   where:{
    email
   },
   transaction:this.session

     })
     return user ? toUser(user):null;
  }


}
