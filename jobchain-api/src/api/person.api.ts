import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { PersonModel } from "../models/index";
import { HTTP_VERSION_NOT_SUPPORTED } from "http-status-codes";

export class PersonApi extends LocalApi {
    personRegistry: ParticipantRegistry;
    constructor() {
        super();
        this.initializeRoutes();
        this.initRegistry();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.getPersons, method: "get", endPoint: "/persons" },
            { action: this.createPerson, method: "post", endPoint: "/person" },
            { action: this.getPerson, method: "get", endPoint: "/person/:email" },
            { action: this.updatePerson, method: "put", endPoint: "/person/:id" }
        ];
    }
    async initRegistry() {
        this.personRegistry = await blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Person");
    }

    createPerson = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, person } = this.getResourceFromModel(req.body);
            if (resource) {
                let personExists = await this.personExists(person);
                if (personExists) {
                    res.status(HttpStatus.BAD_REQUEST).send("Person is invalid");
                }
                else {
                    await this.personRegistry.add(resource);
                    res.status(HttpStatus.CREATED).send(person);
                }
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).send("Person is invalid");
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }

    updatePerson = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Person Not Implemented");
    }

    getPerson = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await this.personRegistry.getAll();
        let person = resources.map((resource => new PersonModel(resource))).find(p => p.credentials.email == req.params.email);
        res.send(person);
    }

    getPersons = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get Persons Not Implemented");
    }

    getResourceFromModel(model: PersonModel) {
        let person = new PersonModel(model);
        if (!person.isValid()) return null;

        let resource = blockChainNetwork.factory.newResource('ca.jobchain', 'Person', person.personId);
        resource.description = person.description;
        resource.firstName = person.firstName;
        resource.lastName = person.lastName;
        resource.phone = person.phone;
        resource.credentials = blockChainNetwork.factory.newConcept("ca.jobchain", "Credentials");
        resource.credentials.email = person.credentials.email;
        resource.credentials.password = person.credentials.password;
        return { resource, person };
    }

    //TODO: This should be validated directly on the blockchain network using the cto
    async personExists(person: PersonModel) {
        let allResources = await this.personRegistry.getAll();
        let allPersons: PersonModel[] = allResources.map(r => new PersonModel(r));
        return allPersons.some(p => p.credentials.email == person.credentials.email);
    }
}