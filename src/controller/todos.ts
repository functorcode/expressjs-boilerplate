import express from 'express';
import {Todo} from "../entity/Todo";
import {Request,Response} from "express";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";

//export const todoRouter=express.Router();
const getTodos=async (req:Request,res:Response)=>{
    let repo=req.db.getRepository(Todo);
    let todolist=await repo.find();
    res.send(todolist);
}

const getTodoById= async (req:Request,res:Response)=>{
    let repo=req.db.getRepository(Todo);
    let todo=await repo.findOne(req.params.id);
    if(todo !== undefined)
      {
        res.send(todo);
      }
      else
      {
        res.status(404).send({'msg':'not found'});
      }


}
const addTodo=async (req:Request,res:Response)=>{

    let todo=plainToClass(Todo,req.body);
    await req.db.manager.save(todo);
    res.status(201).send({'id':todo.id}); 
     
}

const updateTodo=async (req:Request,res:Response)=>{
    await req.db.manager.update(Todo,{id:req.params.id},req.body)
    res.send({});
 
}
const deleteTodo= async (req:Request,res:Response)=>{
    await req.db.manager.delete(Todo,{id:req.params.id})
    res.send({})

}
export const todoController={
  getTodo:getTodos,
  getTodoById:getTodoById,
  addTodo:addTodo,
  updateTodo:updateTodo,
  deleteTodo:deleteTodo
}
