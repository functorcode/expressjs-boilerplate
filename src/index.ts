import "reflect-metadata";
import {Connection} from "typeorm";
import {User} from "./entity/User";
import {createApp} from "./app";

//import {devDbConfig} from './connection.config'
createApp().then(async context => {

    const app=context.app;
    const port: number=3000;
    app.listen(port,()=>{
      console.log(`server started on ${port} `);
    });
    
   

}).catch(error => console.log(error));


