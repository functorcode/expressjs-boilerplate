
import chai from "chai";
import chaiHttp from "chai-http";
import {createApp,AppContext} from "../src/app";
import {request,expect} from "chai";
import {Todo} from "../src/entity/Todo";
//import {testDbConfig} from '../src/connection.config'

chai.use(chaiHttp);
let context:AppContext;
describe("test",()=>{

    before(async ()=>{
        context=await createApp();
        await context.dbConnection.synchronize(true);
        //context.dbConnection.runMigrations();

      })
    after(()=>{
      context.dbConnection.close();
    })
    it("GET /todo should return empty list",async ()=>{
      const res=await request(context.app).get("/todo");
      expect(res.status).to.equal(200);
      expect(res.body).to.eql([]);
    });
    it('GET /todo/:id should return 404 with msg not found', async()=>{
      const res=await request(context.app).get("/todo/1");
      expect(res.status).to.equal(404);
      expect(res.body).to.eql({'msg':'not found'});
    });

    it('GET /todo  should return list of todos',async ()=>{
      let todo1=new Todo();
      let todo2=new Todo();
      todo1.detail='task 1';
      todo1.status='done';
      todo2.detail='task 2';
      todo2.status='done';
      await context.dbConnection.manager.save(todo1);
      await context.dbConnection.manager.save(todo2);
      const res=await request(context.app).get("/todo");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);

    });

    it ('GET /todo/:id should return 1 todo item',async ()=>{
      let todo1=new Todo();
      let todo2=new Todo();
      todo1.detail='task 1';
      todo1.status='done';
      todo2.detail='task 2';
      todo2.status='done';
      await context.dbConnection.manager.save(todo1);
      await context.dbConnection.manager.save(todo2);
      const res= await request(context.app).get(`/todo/${todo1.id}`)
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('id',todo1.id);
 
    });

    it('POST  /todo should make entry in database',async() =>{
      let todo={
        detail:'Task 1',
        status:'pending'
      }
      const res=await request(context.app)
                      .post("/todo")
                      .send(todo);
      expect(res.status).to.equal(201);
      expect(res.body).to.haveOwnProperty('id');
      
      const newid=res.body.id;
      const repo= await context.dbConnection.getRepository(Todo); 
      const newtodo=await repo.findOne(newid);
      expect(newtodo).to.not.be.undefined;
      
    });
    it('POST /todo with invalid data should return error',async()=>{
      let badtodo={
        name:'Task 1'
      }
      const res=await request(context.app)
                      .post("/todo")
                      .send(badtodo);
      expect(res.status).to.equal(400);
 
    });
    
    it('PUT /todo/:id should update the record',async()=>{
       let todo={
        detail:'Task 1',
        status:'pending',
        id:0
      }
      await context.dbConnection.manager.save(Todo,todo);
      const res=await request(context.app)
                      .put(`/todo/${todo.id}`)
                      .send({detail:'Task 100'})
      expect(res.status).to.eq(200);
      let utodo=await context.dbConnection.manager.findOne(Todo,todo.id);
      expect(utodo.detail).to.be.equal("Task 100");


    });

    it('DELTE /todo/:id should remove record from database ', async()=>{
       let todo={
        detail:'Task 1',
        status:'pending',
        id:0
      }

      await context.dbConnection.manager.save(Todo,todo);
      let ntodo=await context.dbConnection.manager.findOne(Todo,todo.id);
      expect(ntodo.id).to.be.equal(todo.id);

      const res=await request(context.app)
                      .delete(`/todo/${todo.id}`)

      expect(res.status).to.eq(200);
      
      let ntodo1=await context.dbConnection.manager.findOne(Todo,todo.id);
      expect(ntodo1).to.be.undefined;
     
    });

  });



