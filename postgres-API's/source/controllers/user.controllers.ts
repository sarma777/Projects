// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
	checkUserEmail,registerUser, updatingUser, deletingUser, reRegisterDeletedUser,
} from '../services/userservices';
import { users, loginUsers } from '../types/user';

// interface for 

// For Register API
export const createUser = async (req: Request, res: Response) => {
// get input params
	const inputParams: users = req.body;
	// if the inputs are empty give an error
	if (!inputParams.Email && !inputParams.Password && !inputParams.First_name && !inputParams.Last_name && !inputParams.Phone) {
		res.json({
			user_message: 'Please enter required fields(First_name, Last_name, Phone, Email, Password)'
		})
		return;
	} else if (!inputParams.Email || inputParams.Email.trim() === "") {
		res.json({
			user_message: 'Please enter Email'
		})
		return;
	} else if (!inputParams.First_name || inputParams.First_name.trim() === "") {
		res.json({
			user_message: 'Please enter First_name'
		})
		return;
	} else if (!inputParams.Last_name || inputParams.Last_name.trim() === "") {
		res.json({
			user_message: 'Please enter Last_name'
		})
		return;
	} else if (!inputParams.Password || inputParams.Password.trim() === "") {
		res.json({
			user_message: 'Please enter Password'
		})
		return;
	} else if (!inputParams.Phone || inputParams.Phone.trim() === "") {
		res.json({
			user_message: 'Please enter Phone Number'
		})
		return;
	}
	// hashing password
	bcrypt.hash(inputParams.Password, 10, async (err: Error | undefined, hashedPassword) => {
		if (err) {
			return err;
		}
		const userDetails: users = {
			First_name: inputParams.First_name,
			Last_name: inputParams.Last_name,
			Phone: inputParams.Phone,
			Email: inputParams.Email,
			Password: hashedPassword,
		}
		// storing registerDbQuery in a variable for checking if the user has already registered or not
		const userDoc = await checkUserEmail(req.body.Email);
		// if the user is already registered and deleted his profile
		if (userDoc?.isArchived === 1) {
			const insertDeletedUser = await reRegisterDeletedUser(req.body.Email, userDetails);
			if (insertDeletedUser) {
				res.status(200).json({
					user_message: 'Successfully Registered',
					Email: userDoc.Email
				});
				return;
			} else {
				res.status(500).json({
					user_message: 'Something went wrong'
				});
				return;
			}
		}
		// if the user is not registered insert into Database
		else if (userDoc === undefined) {
			// using insertUser Database query to insert data into Database
			const result = await registerUser(userDetails);
			if (result) {
				res.status(200).json({
					user_message: 'Successfully Registered',
					Email: userDetails.Email
				});
				return;
			} else {
				res.status(500).json({
					user_message: 'Something went wrong'
				});
				return;
			}
		}
		// if the user is already registered with this email 
		else {
			res.status(406).json({
				user_message: 'Already registered with this email'
			});
			return;
		}
	})
};
// For login API
export const loginUser = async (req: Request, res: Response) => {
	// get input params
	const loginData: loginUsers = req.body

	// if the inputs are empty give an error
	if (!loginData.Email && !loginData.Password) {
		res.json({
			user_message: 'Please enter required fields(Email, Password)'
		})
		return;
	} else if (!loginData.Email) {
		res.json({
			user_message: 'Please enter Email'
		})
		return;
	} else if (!loginData.Password) {
		res.json({
			user_message: 'Please enter Password'
		})
		return;
	}
	// query to check if the user email is in the db or not
	const userDoc = await checkUserEmail(loginData.Email);
	// if the user account is deleted
	if (userDoc?.isArchived === 1) {
		res.status(404).json({
			user_message: 'Account with this email has been deleted'
		})
	} else if (userDoc) {
		bcrypt.compare(loginData.Password, userDoc.Password, async (err, results) => {
			// if the passwords do not match thorw an err
			if (err) {
				res.send(404).json({
					user_message: err
				})
				return;
			} else if (results) {
				// Create a new token with the email in the payload
				// and which expires 5minitues after issue
				const token = jwt.sign({ Email: loginData.Email }, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '5hr' });
				res.status(200).json({
					user_message: 'Login successfull',
					token,
					user: {
						First_name: userDoc?.First_name,
						Last_name: userDoc?.Last_name,
						Email: userDoc?.Email,
						Phone: userDoc?.Phone
					},
				});
				return;
			} else if (!results) {
				// if passwords do not match give an error Please check your credentials
				res.status(401).json({
					user_message: 'Please Check your credentials'
				});
				return;
			}
		})
	}
	else {
		res.status(401).json({
			user_message: 'Please Check your credentials'
		});
		return;
	}
}
// For update API
export const updateUser = async (req: Request, res: Response) => {
	// get input params
	const inputParams: users = req.body;
	// if the inputs are empty give an error
	if (inputParams.First_name === '') {
		res.json({
			user_message: 'Please enter First_name'
		})
		return;
	} else if (inputParams.Last_name === '') {
		res.json({
			user_message: 'Please enter Last_name'
		})
		return;
	} else if (inputParams.Phone === '') {
		res.json({
			user_message: 'Please enter Phone Number'
		})
		return;
	}
	// query to check if the user email is in the db or not
	const userDoc = await checkUserEmail(req.body.Email);
	if (userDoc) {
		let hashedPassword;
		// if the user does'nt want to change password and wants to update other details
		// store the inputParams in one object
			const user: users = {
				First_name: inputParams.First_name,
				Last_name: inputParams.Last_name,
				Email: inputParams.Email,
				Phone: inputParams.Phone
			}
			if (inputParams.Password) {
				// for hashing the Password
				const salt = await bcrypt.genSalt();
				hashedPassword = await bcrypt.hash(inputParams.Password, salt);
				user.Password = hashedPassword;
			}
			// for updating the Database pass the user object and the email we got from token as parameters
			const result = await updatingUser(user, req.body.Email);
			// if the result is true
			if (result) {
				res.status(200).json({
					user_message: 'Updated successfully',
					user: user
				});
				return;
			} else {
				res.status(500);
				return;
			}
	}
};
// For delete API
export const deleteUser = async (req: Request, res: Response) => {
	// query to check if the user email is in the db or not
	const userDoc = await checkUserEmail(req.body.Email);
	// If the user is already deleted
	if(userDoc?.isArchived === 1) {
		res.status(404).json({
			user_message: 'Account with this email has been already deleted'
		});
		return;
	}
	// if the user is not deleted
	else if (userDoc) {
		const result = await deletingUser(req.body.Email);
		if (result) {
			res.status(200).json({
				user_message: 'Deleted successfully'
			});
			return;
		} else {
			res.status(500);
			return;
		}
	}
};

export const getUser = async (req: Request, res: Response) => {
	const inputParams = req.body;

	let user = await checkUserEmail(inputParams.Email);
	
	if(user) {
		res.status(200).json({
			user_message: 'User details',
			data: {
				First_name: user.First_name,
				Last_name: user.Last_name,
				Email: user.Email,
				Phone: user.Phone
			}
		});
		return;
	} else{
		res.status(400).json({
			user_message:'User not found!!'
		});
		return;
	}
}