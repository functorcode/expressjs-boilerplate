import chai from "chai";
import chaiHttp from "chai-http";
import {createApp,AppContext} from "../src/app";
import {request,expect} from "chai";
import {Todo} from "../src/entity/Todo";
import {User} from "../src/entity/User";

chai.use(chaiHttp);
let context:AppContext;

describe("User test",()=>{
  before(async()=>{
    context=await createApp();
  })
  after(()=>{
    context.dbConnection.close();
  })
  beforeEach(async()=>{
    await context.dbConnection.synchronize(true);
  })

  it("POST /register should create user in database",async()=>
     {
       let newuser=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res=await request(context.app)
                      .post("/register")
                      .send(newuser)
      expect(res.status).to.equal(201);
      
      let dbUser= await context.dbConnection.manager.findOne(User,{email:newuser.email})
      expect(dbUser).not.to.be.undefined;

     })
  it("POST /register fails with invalid data",async ()=>{
   let newuser1=
         {
          abc:"abc@email.com",
          password:"abc123"
         }
    let newuser2=
         {
          email:"mail.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/register")
                      .send(newuser1)
      const res2=await request(context.app)
                      .post("/register")
                      .send(newuser2)
      expect(res1.status).to.equal(400);
      expect(res2.status).to.equal(400);
     
  })

  it("POST /register password should not be plain text",async()=>{
    let newuser=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res=await request(context.app)
                      .post("/register")
                      .send(newuser)
      expect(res.status).to.equal(201);
      
      let dbUser= await context.dbConnection.manager.findOne(User,{email:newuser.email})
      expect(dbUser).not.to.be.undefined;
      expect(dbUser.password).not.to.be.equal(newuser.password);
    

  })
  it("POST /register should not allow duplicate email",async()=>{
    let newuser1=
         {
          email:"abc@email.com",
          password:"abc123"
         }
    let newuser2=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/register")
                      .send(newuser1)
      const res2=await request(context.app)
                      .post("/register")
                      .send(newuser2)
      expect(res1.status).to.equal(201);
      expect(res2.status).to.equal(400);
    
  })
  it("POST /token should return jwt token on valid creds",async()=>{
    let newuser1=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/register")
                      .send(newuser1)
      const res2=await request(context.app)
                      .post("/token")
                      .send(newuser1)
      expect(res1.status).to.equal(201);
      expect(res2.status).to.equal(200);
      expect(res2.body).to.have.property('token');
    


  })
  it("POST /token should return 400 for non-register user",async()=>{
     let newuser1=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/token")
                      .send(newuser1)

      expect(res1.status).to.equal(400);
    
  })
 it("POST /token should return 400 for invalid password",async()=>{
     let newuser1=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/register")
                      .send({email:newuser1.email,password:'123'})
      expect(res1.status).to.equal(201);
      const res2=await request(context.app)
                      .post("/token")
                      .send(newuser1)

      expect(res2.status).to.equal(400);
    
  })
  it('GET /user should return 200 when passed valid token in header',async()=>{
      let newuser1=
         {
          email:"abc@email.com",
          password:"abc123"
         }
      const res1=await request(context.app)
                      .post("/register")
                      .send(newuser1)

      expect(res1.status).to.equal(201);
      const res2=await request(context.app)
                      .post("/token")
                      .send(newuser1)

      expect(res2.status).to.equal(200);
      let token=res2.body.token;
      const res3=await request(context.app)
                       .get('/user')
                       .auth(token,{type:'bearer'})
      expect(res3.status).to.equal(200);
      expect(res3.body).not.have.property('password');

     
  })
  it('GET /user should return 401 without valid token',async()=>{
      const res1=await request(context.app)
                       .get('/user')
                       .auth('kasd',{type:'bearer'})
      const res2=await request(context.app)
                       .get('/user')

      expect(res1.status).to.equal(401);
      expect(res2.status).to.equal(401);
  })
 
 

})
