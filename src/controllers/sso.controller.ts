import { Router } from 'express';
import { SsoManager } from '../managers';
import { logger } from '../config';

export class SsoController {
	public static route = '/saml';
	public router: Router;
	private ssoManager: SsoManager;

	constructor() {
		this.ssoManager = new SsoManager();
		this.router = Router();
		this.init();
	}

	public init() {
		this.router.get('/metadata', this.getMetaData);
		this.router.get('/ssoredirect', this.redirectToSSO)
		this.router.post('/SSO', this.parseInformation)
	}

	public getMetaData = async (request, response, nextFunction) => {
		try {
			logger.info(`"JD RCTS SSO" GET /metadata "<<<Getmetadata started triggered>>>"`);
			let result = this.ssoManager.getMetaData();
			response.header('Content-Type', 'text/xml').send(result)
			logger.info(`"JD RCTS SSO" GET /metadata "<<<Getmetadata ended with success>>>"`);
		} catch (error) {
			logger.error(`"JD RCTS SSO" GET /metadata "<<<Getmetadata ended with failure>>> response" ${JSON.stringify(error)}`);
			response.status(500).send(error);
		}
	};

	public redirectToSSO = async (request, response, nextFunction) => {
		try {
			logger.info(`"JD RCTS SSO" GET /ssoredirect "<<<RedirecttoSSO started triggered>>> request" ${JSON.stringify(request.query)}`);
			let result = await this.ssoManager.redirectToSSO(request.query.relayState, request.query.domain);
			const { id, context } = result;
			logger.info(`"JD RCTS SSO" GET /ssoredirect "<<<RedirecttoSSO ended with success>>>"`);
			return response.redirect(context);
		} catch (error) {
			logger.error(`"JD RCTS SSO" GET /ssoredirect "<<<RedirecttoSSO ended with failure>>> response" ${JSON.stringify(error)}`);
			response.status(500).send({ message: error });
		}
	};

	public parseInformation = async (request, response, nextFunction) => {
		try {
			logger.info(`"JD RCTS SSO" POST /SSO "<<<parseInformation started triggered>>> request" ${JSON.stringify(request.body)}`);
			let result = await this.ssoManager.parseInformationFromIdp(request.body, request);
			logger.info(`"JD RCTS SSO" POST /SSO "<<<parseInformation ended with success>>> response" ${JSON.stringify(result)}`);
			logger.info(`"JD RCTS SSO" POST /SSO "<<<redirect url >>>" ${JSON.stringify(result["redirectUrl"] + '?access_token=' + result["token"] + '&domain=' + result["domain"])}`)
			return response.redirect(result["redirectUrl"] + '?access_token=' + result["token"] + '&domain=' + result["domain"]);
		} catch (error) {
			logger.error(`"JD RCTS SSO" POST /SSO "<<<parseInformation ended with failure>>> response" ${JSON.stringify(error)}`);
			response.status(500).send({ message: error });
		}
	};

}
