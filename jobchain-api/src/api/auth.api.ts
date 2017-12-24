import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, PersonModel, OrganizationTypeModel } from "../models/index";
import { environment } from "../environment";

export class AuthApi extends LocalApi {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.authenticate, method: "post", endPoint: "/authenticate" },
            { action: this.createPerson, method: "post", endPoint: "/person" },
            { action: this.createOrganization, method: "post", endPoint: "/organization" },
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

    createPerson = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, person } = this.getPersonResourceFromModel(req.body);
            if (resource) {
                let personExists = await this.personExists(person);
                if (personExists) {
                    res.status(HttpStatus.BAD_REQUEST).send("Person is invalid");
                }
                else {
                    await blockChainNetwork.registries.person.add(resource);
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
    getPersonResourceFromModel(model: PersonModel) {
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
        let allResources = await blockChainNetwork.businessNetworkConnection.query("getPersonByEmail", { email: person.credentials.email });
        return allResources.length > 0;
    }

    createOrganization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, organization } = this.getOrganizationResourceFromModel(req.body);
            if (resource) {
                let orgExists = await this.organizationExists(organization);
                if (orgExists){
                    res.status(HttpStatus.BAD_REQUEST).send("Organization is invalid");
                }
                else{
                    await blockChainNetwork.registries.organization.add(resource);
                    res.status(HttpStatus.CREATED).send(organization);
                }
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).send("Organization is invalid");
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    getOrganizationResourceFromModel(model: OrganizationModel) {
        let organization = new OrganizationModel(model);
        if (!organization.isValid()) return null;

        let resource = blockChainNetwork.factory.newResource('ca.jobchain', 'Organization', organization.organizationId);
        resource.name = organization.name;
        resource.description = organization.description;
        resource.verified = organization.verified;
        resource.credentials = blockChainNetwork.factory.newConcept("ca.jobchain", "Credentials");
        resource.credentials.email = organization.credentials.email;
        resource.credentials.password = organization.credentials.password;
        resource.address = blockChainNetwork.factory.newConcept("ca.jobchain", "Address");
        resource.address.address = organization.address.address;
        resource.organizationTypes = organization.organizationTypes.map(org => OrganizationTypeModel[org]);
        return { resource, organization };
    }

    //TODO: This should be validated directly on the blockchain network using the cto
    async organizationExists(organization: OrganizationModel){
        let allResources = await blockChainNetwork.businessNetworkConnection.query("getOrganizationByEmail", { email: organization.credentials.email });
        return allResources.length > 0;
    }
}