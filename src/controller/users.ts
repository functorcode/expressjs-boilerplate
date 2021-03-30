import express from 'express';
import {User} from "../entity/User";
import {Request,Response} from "express";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import bcrypt from 'bcrypt';
import {QueryFailedError} from "typeorm"

const registerUser=async (req:Request,res:Response,next)=>{
    let user=plainToClass(User,req.body);
    let saltRounds=10;
    let salt=await bcrypt.genSalt(saltRounds) ;//, (err, salt) => {
    let hash=await bcrypt.hash(user.password, salt) ;//, async (err, hash) => {
    // Now we can store the password hash in db.
    user.password=hash;
    await req.db.manager.save(user);
    res.status(201).send({'id':user.id}); 
}

const getToken=async(req:Request,res:Response,next)=>{

    let user=plainToClass(User,req.body);
    let dbUser=await req.db.manager.findOne(User,{email:user.email})
                      .catch(err=>next(err));
    if(dbUser)
     {
       let match=await bcrypt.compare(user.password,dbUser.password);
       if(match)
         {
           res.send({'token':'valid token'})
         }
         else
         {
           res.status(400).send({'msg':'Invalid Token'})
         }

     }
     else
     {
      res.status(400).send({'msg':'User not registered'})
     }

}
export const userController={
    registerUser:registerUser,
    getToken:getToken
}


