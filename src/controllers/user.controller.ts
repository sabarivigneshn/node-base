import { Router } from 'express';
import { UserManager } from './../managers/user.manager';
import ResponseHelper from './../helpers/response.helper';
import { ErrorHandler } from './../helpers';
export class UserController extends ErrorHandler {
	public static route = '/user';
	public router: Router;

	constructor() {
		super();
		this.router = Router();
		this.init();
	}

	public init() {
		this.router.get('/login', this.userLogin);

	}
	private userLogin = async (request, response, next) => {
		try {
			const responseObj = await new UserManager().postUserLogin(request.body);
			ResponseHelper.Ok(response, responseObj);
		} catch (error) {
			ResponseHelper.Error(request, response, error);
		}
	}
}
