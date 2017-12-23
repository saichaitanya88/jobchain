import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, PersonModel } from "../models/index";

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
                res.send(new PersonModel(persons[0]));
                return;
            }

            let organizations = await blockChainNetwork.businessNetworkConnection
                .query("getOrganizationByCredentials", { email: req.body.email, password: req.body.password });
            if (organizations.length > 0) {
                res.send(new OrganizationModel(organizations[0]));
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