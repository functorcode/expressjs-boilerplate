import express from 'express';
require('express-async-errors'); //requires to catch all async errors
import {Connection,createConnection,ConnectionOptions} from 'typeorm';
import {Express,Request,RequestHandler} from "express";
import {todoController} from "./controller/todos";
import {userController} from "./controller/users";
import {Todo} from "./entity/Todo";
import {User} from "./entity/User";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import config from './ormconfig';
import jsonwebtoken from 'jsonwebtoken';

export type AppContext=
  {
    app:Express,
    dbConnection:Connection
  }

//validation middleware
const validateBody=<T>(cls:any,skipMissingProperties=false)=>{
  return  async (req,res,next)=>{

    let obj=plainToClass(cls,req.body);

    let errors=await validate(obj,{skipMissingProperties});
    if(errors.length>0)
      {
        let errlist:object[]= errors.map(er=>Object.values(er.constraints))
        res.status(400).send(errlist)
      }
      else{
        next();
     }


  }
}

//authenticaiton middleware  
const authRequest=()=>{
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

//https://stackoverflow.com/questions/43429574/how-can-i-handle-type-with-middleware-of-express
export const createApp=async () :Promise<AppContext>=>{
  const app=express();
  const dbConnection=await createConnection(config);

  app.use(express.json());

  //make db,tokenSecret available so all route can use
  app.use((req: Request ,res,next)=>{
    req.db=dbConnection

    //use this to generate secret and save it in env
    //require('crypto').randomBytes(64).toString('hex')
    req.tokenSecret='21321knmdfndsk23jaksdajfkdjl';
 
    next() 
  })

  

  app.get('/',(req:Request,res)=>{
    res.send("hello world");
  })

  app.post("/register",validateBody(User),userController.registerUser);
  app.post("/token",validateBody(User),userController.getToken);
  app.get("/user",authRequest(),userController.getUser);

  app.get("/todo",todoController.getTodo);
  app.get('/todo/:id',todoController.getTodoById);
  app.post('/todo',validateBody(Todo),todoController.addTodo);
  app.put('/todo/:id',validateBody(Todo,true),todoController.updateTodo);
  app.delete('/todo/:id',todoController.deleteTodo)
 
  //catch all uncaughted errors
  app.use(function (err, req, res, next) {
   //console.error(err)
   if(err.code==23505)
     {
      res.status(400).send('Duplicated entry');  
     }
     else
     {
      res.status(500).send('Internal server error')
     }
  })
  return {app,dbConnection};

}
