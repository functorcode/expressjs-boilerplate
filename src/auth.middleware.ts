import {User} from "./entity/User";
import jsonwebtoken from 'jsonwebtoken';
import {Request} from "express";
//authenticaiton middleware  
export const authRequest=()=>{
  return async (req:Request,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    try {
      var _email = jsonwebtoken.verify(token,req.tokenSecret );
      //fetch user from db 
      let user=undefined;
      if(typeof _email=== 'string')
        {
           user=await req.db.manager.findOne(User,{email:_email});
        }
      else
        res.sendStatus(401);
      if(user)
        {
          user.password='';
          req.user=user;
          next();
        }
        else
        {
          res.sendStatus(401);
        }
    } catch(err) {
      // err
        res.sendStatus(401)

    }
  }
}

