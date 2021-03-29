import {ConnectionOptions} from "typeorm";
const config:ConnectionOptions= {
   "type": "postgres",
   "name":"default",
   "host": process.env.SQL_HOST,
   "port": Number(process.env.SQL_PORT)||0,
   "username": process.env.SQL_USERNAME,
   "password": process.env.SQL_PASSWORD,
   "database": process.env.SQL_DATABASE,
   "synchronize": true,
   "logging": false,
   "entities": [
      __dirname + '/entity/**/*{.ts,.js}'
   ],
   "migrations": [
      __dirname+ "/migration/**/*{.ts,.js}"
   ],
   "subscribers": [
    __dirname +"/subscriber/**/*{.ts,.js}"
   ],
   "cli": {
        "migrationsDir": "src/migration"
   }
}
export default config;
