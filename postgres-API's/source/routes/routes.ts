// eslint-disable-next-line import/no-extraneous-dependencies
import * as handler from '../controllers/user.controllers';
import * as middileware from '../controllers/validations';

export const routes = [
	{
		verb:'get',
		path:'/userDetails',
		middleware:[middileware.jwtTokenValidation],
		handler:handler.getUser
	},
	{
		verb:'post',
		path:'/register',
		handler:handler.createUser
	},
	{
		verb:'post',
		path:'/login',
		handler:handler.loginUser
	},
	{
		verb:'put',
		path:'/updateUser',
		middleware:[middileware.jwtTokenValidation],
		handler:handler.updateUser
	},
	{
		verb:'delete',
		path:'/deleteUser',
		middleware:[middileware.jwtTokenValidation],
		handler:handler.deleteUser
	}
];