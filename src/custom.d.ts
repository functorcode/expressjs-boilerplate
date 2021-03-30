import {Connection} from 'typeorm';
import {User} from './entity/User';

declare module 'express'

{ 
  export interface Request{
    db:Connection
    tokenSecret:string,
    user?:User
  }
}

