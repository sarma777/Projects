// import mysql from 'mysql';
import * as dotenv from 'dotenv';
import {createConnection} from 'typeorm';
import { User } from '../entity/user';
dotenv.config();


const connection =  createConnection({
	type:'postgres',
	host:process.env.DB_HOST,
	port: 5434,
	username:process.env.DB_USER,
	password:process.env.DB_PASSWORD,
	database:process.env.DB_NAME,
	entities: [
		User
	],
	synchronize: true,
	logging: false
})

connection.then(connected => {
	console.log('Connected to db')
}).catch (error => console.log(error));

export default connection;