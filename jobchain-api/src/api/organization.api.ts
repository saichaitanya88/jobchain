import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, OrganizationTypeModel } from "../models/index";

export class OrganizationApi extends LocalApi {
    organizationRegistry: ParticipantRegistry;
    
    constructor() {
        super();
        this.initializeRoutes();
        this.initRegistry();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.getOrganizations, method: "get", endPoint: "/organizations" },
            { action: this.createOrganization, method: "post", endPoint: "/organization" },
            { action: this.getOrganization, method: "get", endPoint: "/organization/:email" },
            { action: this.updateOrganization, method: "put", endPoint: "/organization/:id" },
        ];
    }
    async initRegistry() {
        this.organizationRegistry = await blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Organization");
    }
    createOrganization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, organization } = this.getResourceFromModel(req.body);
            if (resource) {
                let orgExists = await this.organizationExists(organization);
                if (orgExists){
                    res.status(HttpStatus.BAD_REQUEST).send("Organization is invalid");
                }
                else{
                    await this.organizationRegistry.add(resource);
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
    updateOrganization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Organizations Not Implemented");
    }
    getOrganization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await this.organizationRegistry.getAll();
        let organization = resources.map((resource => new OrganizationModel(resource))).find(o => o.credentials.email == req.params.email)
        res.send(organization);
    }
    getOrganizations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await this.organizationRegistry.getAll();
        res.send(resources.map((resource => new OrganizationModel(resource))));
    }

    getResourceFromModel(model: OrganizationModel) {
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
        let allResources = await this.organizationRegistry.getAll();
        let allOrgs: OrganizationModel[]= allResources.map(r => new OrganizationModel(r));
        return allOrgs.some(o => o.credentials.email == organization.credentials.email);
    }
}