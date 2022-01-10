// eslint-disable-next-line import/no-extraneous-dependencies
import {
	Entity, Column, BaseEntity, PrimaryGeneratedColumn,  
} from 'typeorm';

@Entity()
export class Client extends BaseEntity {
    @Column()
    	name!: string;

    @PrimaryGeneratedColumn()
    	id!: number;

}