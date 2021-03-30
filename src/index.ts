import "reflect-metadata";
import {Connection} from "typeorm";
import {User} from "./entity/User";
import {createApp} from "./app";

//import {devDbConfig} from './connection.config'
createApp().then(async context => {
    //await addSeedData(connection) 

    const app=context.app;
    const port: number=3000;
    app.listen(port,()=>{
      console.log(`server started on ${port} `);
    });
    
   

}).catch(error => console.log(error));

const addSeedData=async (connection:Connection)=>  {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");
 
}
