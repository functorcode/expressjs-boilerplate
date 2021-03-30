import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {IsEmail,IsString} from 'class-validator';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      unique:true
    }
    )
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    password:string;
    /*
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
    */

}
