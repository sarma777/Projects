// eslint-disable-next-line import/no-extraneous-dependencies
import express, {
Request, Response, NextFunction
} from 'express';
import * as dotenv from 'dotenv';
import {routes} from './routes/routes';
import connection from './db/db';
import cookieParser from 'cookie-parser';

connection;

dotenv.config()


const app: any = express();
// app.use(cors());
const port = 6000;
app.use(express.json());
app.use(cookieParser());


// app.use((req:Request,resp:Response,next:Nex) => {

// })
app.use(function (req: Request, res: Response, next: NextFunction) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', '*');

	// res.setHeader('Access-Control-Allow-Headers', 'Content-type');


	// res.setHeader('Access-Control-Allow-Heades','*');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	// res.setHeader('Access-Control-Allow-Credentials', 'true');

	// Pass to next layer of middleware
	next();
});

routes.forEach(route => {
	if(route.middleware) {
		app[route.verb](route.path,route.middleware,route.handler);
	} else {
		app[route.verb](route.path,route.handler);
	}
});

app.listen(process.env.PORT || port, () => {
	console.log('App is running in ' + process.env.PORT || port);
});