import {
	Request, Response, NextFunction 
} from 'express';
import jwt from 'jsonwebtoken';

export const jwtTokenValidation = (req: Request, res: Response, next: NextFunction) => {
	// check if the user has a token or not
	// if the user dose'nt have token give an error "Not authorized"
	if (
		!req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization?.split(' ')[1]
	) {
		res.status(401).json({
			user_message: 'Not authorized'
		});
		return;
	}
	// if the user has token check if that token is valid or not
	// if the token is not valid give an error "Not authorized"
	// if the token is valid call the handler using next()
	else if (req.headers.authorization?.split(' ')[1]) {
		const theToken = req.headers.authorization?.split(' ')[1];
		jwt.verify(theToken, process.env.TOKEN_SECRET_KEY as string, async (err, payload) => {
			if (err) {
				res.status(403).json({
					user_message: 'Not authorized'
				});
				return;
			} else {
				req.body = Object.assign({}, req.body, payload)
				next();
			}
		});
	}

}