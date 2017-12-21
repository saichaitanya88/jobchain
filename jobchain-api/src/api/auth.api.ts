import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, PersonModel } from "../models/index";

export class AuthApi extends LocalApi {
    organizationRegistry: ParticipantRegistry;
    personRegistry: ParticipantRegistry;

    constructor() {
        super();
        this.initializeRoutes();
        this.initRegistry();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.authenticate, method: "post", endPoint: "/authenticate" }
        ];
    }

    // TODO: move registry to blockChainNetwork object, and reuse same reference rather than creating a reference in each Api controller
    async initRegistry() {
        this.organizationRegistry = await blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Organization");
        this.personRegistry = await blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Person");
    }

    // TODO: authenticate using Query rather than array filtering
    authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let persons = await this.personRegistry.getAll();
            let person = persons.find(p => p.credentials.email == req.body.email && p.credentials.password == req.body.password);
            if (person) {
                res.send(new PersonModel(person));
                return;
            }
            let organizations = await this.organizationRegistry.getAll();
            let organization = organizations.find(o => o.credentials.email == req.body.email && o.credentials.password == req.body.password);
            if (organization) {
                res.send(new OrganizationModel(organization));
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