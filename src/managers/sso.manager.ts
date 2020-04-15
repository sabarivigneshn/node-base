import { NextFunction, Request, Response } from 'express';
import * as saml from 'samlify';
import * as fs from "fs";
var jwt = require('jsonwebtoken');
import * as appRoot from 'app-root-path'
import { pathConfig } from '../config/pathConfig';
import { logger } from '../config';
const xmlReader = require('read-xml');

export class SsoManager {

    private sp = saml.ServiceProvider({
        metadata: this.getXmlMetaData(),
        wantLogoutRequestSigned: true,
        wantLogoutResponseSigned: true,
        privateKey: fs.readFileSync(appRoot.path + pathConfig.SAMLprivateKeyPath)
    });

    constructor() {
        saml.setSchemaValidator({
            validate: response => {
                /* implment your own or always returns a resolved promise to skip */
                return Promise.resolve('skipped');
            }
        });
    }

    public getMetaData = () => {
        return this.sp.getMetadata()
    }

    public redirectToSSO = async (relayState, domain) => {
        logger.info(`"JD RCTS SSO" GET /redirectToSSO manager "<<<redirectToSSO started triggered>>>"`);
        this.sp.entitySetting.relayState = JSON.stringify({ relayState: relayState, domain: domain });
        try {
            let idpData = await this.identifyIdp(domain)
            return this.sp.createLoginRequest(idpData.idp, 'redirect');
        } catch (error) {
            logger.error(`"JD RCTS SSO" GET /redirectToSSO manager "<<<redirectToSSO ended with failure>>> response" ${JSON.stringify(error)}`);
            throw error;
        }
    }

    private identifyIdp = async (domain) => {
        logger.info(`"JD RCTS SSO" manager "<<<identifyIdp started triggered>>>"`);
        try {
            let idpmetaData = fs.readFileSync(appRoot.path + pathConfig.IDPMetadataPath)
            let idp;
            idp = saml.IdentityProvider({
                metadata: idpmetaData,
                privateKey: fs.readFileSync(appRoot.path + pathConfig.SAMLprivateKeyPath),
                privateKeyPass: '',
                wantLogoutRequestSigned: true,
                wantLogoutResponseSigned: true,
                requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
            });
            return { idp: idp, redirectUrl: 'https://www.google.com' };
        } catch (error) {
            logger.error(`"JD RCTS SSO" manager "<<<identifyIdp ended with failure>>> response" ${JSON.stringify(error)}`);
            throw error;
        }

    }


    public parseInformationFromIdp = async (data, req) => {
        let PRIVATE_KEY = fs.readFileSync(appRoot.path + pathConfig.privateKeyPath)
        const { RelayState } = data;
        logger.info(`"JD RCTS SSO" POST /SSO manager "<<<parseInformationFromIdp started triggered>>>" `);
        try {
            const { relayState, domain } = JSON.parse(RelayState)
            let idpData = await this.identifyIdp("domain")
            let parseResult = await this.sp.parseLoginResponse(idpData.idp, 'post', req)
            const token = jwt.sign(
                ({
                    email: parseResult.extract.nameID,
                    firstName: parseResult.extract.attributes.firstName,
                    lastName: parseResult.extract.attributes.lastName,
                    createdAt: new Date()
                }
                ), PRIVATE_KEY, { algorithm: 'RS256' });
            logger.info(`"JD RCTS SSO" POST /SSO manager "<<<parseInformationFromIdp ended with success>>>" `);
            return { token: token, relayState: relayState, redirectUrl: idpData.redirectUrl, domain: domain }
        }
        catch (error) {
            logger.error(`"JD RCTS SSO" POST /SSO manager "<<<parseInformationFromIdp ended with failure>>> response" ${JSON.stringify(error)}`);
            throw error;
        }
    }

    public getXmlMetaData() {
        let xmlData;
        try {
            xmlReader.readXML(fs.readFileSync(appRoot.path + pathConfig.SPMetadataPath), function (err, data) {
                if (err) {
                    throw err;
                }
                xmlData = data.content.replace(/baseUrl/g, process.env.baseUrl);
            });
            return xmlData;
        } catch (error) {
            throw error;
        }

    }
}
