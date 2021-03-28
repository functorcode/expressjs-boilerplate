import express from 'express';
import {Connection,createConnection} from 'typeorm';
import {Express} from "express";
export type AppContext=
  {
    app:Express,
    dbConnection:Connection
  }

export const createApp=async (dbserver:string) :Promise<AppContext>=>{
  const app=express();
  const dbConnection=await createConnection("test_db");
  app.use(express.json());

  app.get('/',(req,res)=>{
    res.send("hello world");
  })

  return {app,dbConnection};

}
