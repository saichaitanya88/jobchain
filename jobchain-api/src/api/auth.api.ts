import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, PersonModel } from "../models/index";
import { environment } from "../environment";

export class AuthApi extends LocalApi {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.authenticate, method: "post", endPoint: "/authenticate" }
        ];
    }

    authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let persons = await blockChainNetwork.businessNetworkConnection
                .query("getPersonByCredentials", { email: req.body.email, password: req.body.password });
            if (persons.length > 0) {
                let person = new PersonModel(persons[0]);
                //let identity = await blockChainNetwork.businessNetworkConnection.issueIdentity(`ca.jobchain.Person#${person.personId}`, person.personId)
                let token = jwt.sign(JSON.parse(JSON.stringify(person)), environment.secret);
                res.send({ ...person,  credentials: null, token });
                return;
            }

            let organizations = await blockChainNetwork.businessNetworkConnection
                .query("getOrganizationByCredentials", { email: req.body.email, password: req.body.password });
            if (organizations.length > 0) {
                let organization = new OrganizationModel(organizations[0]);
                //let identity = await blockChainNetwork.businessNetworkConnection.issueIdentity(`ca.jobchain.Organization#${organization.organizationId}`, organization.organizationId)
                let token = jwt.sign(JSON.parse(JSON.stringify(organization)), environment.secret);
                res.send({ ...organization, credentials: null, token });
                return;
            }
            res.status(HttpStatus.BAD_REQUEST).send();
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
}