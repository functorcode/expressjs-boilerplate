import {Connection} from 'typeorm';

declare module 'express'

{ 
  export interface Request{
    db:Connection
  }
}

