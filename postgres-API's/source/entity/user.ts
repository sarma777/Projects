import {
	Column, Entity, PrimaryColumn 
} from 'typeorm';

@Entity()
export class User {
    @Column()
    	First_name!: string;

    @Column()
    	Last_name!: string;

    @PrimaryColumn()
    	Email!: string;

    @Column()
    	Password!: string;

    @Column()
    	Phone!: string;

    @Column({
    	default: 0
    })
    	isArchived!: number
}