import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {IsString} from 'class-validator';
type TodoStatus='done'|'pending';
@Entity()
export class Todo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    detail: string;

    @Column()
    @IsString()
    status: string;

}
