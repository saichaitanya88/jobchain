import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { PersonModel } from "../models/index";
import { HTTP_VERSION_NOT_SUPPORTED } from "http-status-codes";

export class PersonApi extends LocalApi {

    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.getPersons, method: "get", endPoint: "/persons" },
            { action: this.getPerson, method: "get", endPoint: "/person/:email" },
            { action: this.updatePerson, method: "put", endPoint: "/person/:id" }
        ];
    }

    

    updatePerson = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Person Not Implemented");
    }

    getPerson = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let persons = await blockChainNetwork.businessNetworkConnection.query("getPersonByEmail", { email: req.body.credentials.email });
        if (persons.length > 0)
            res.send(persons[0]);
        else
            res.status(HttpStatus.NOT_FOUND).send(null);
    }

    getPersons = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get Persons Not Implemented");
    }
}