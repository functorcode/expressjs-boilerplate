import chai from "chai";
import chaiHttp from "chai-http";
import {createApp,AppContext} from "../src/app";
import {request,expect} from "chai";
chai.use(chaiHttp);
let context:AppContext;
describe("test",()=>{

    before(async ()=>{
        context=await createApp("test_db");
      })
    after(()=>{
      context.dbConnection.close();
    })
    it("should return 200 with hello world",async ()=>{
      const res=await request(context.app).get("/");
      expect(res.text).to.equal("hello world");
    });
  });



