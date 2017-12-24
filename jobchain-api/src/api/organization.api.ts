import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";
import { AssetRegistry, ParticipantRegisty as ParticipantRegistry } from "composer-client";

import { LocalApi } from "./index";
import { blockChainNetwork } from "../blockChainNetwork";
import { OrganizationModel, OrganizationTypeModel } from "../models/index";

export class OrganizationApi extends LocalApi {
    
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { action: this.getOrganizations, method: "get", endPoint: "/organizations" },
            { action: this.getEducationOrgs, method: "get", endPoint: "/organizations/education" },
            { action: this.getCompanyOrgs, method: "get", endPoint: "/organizations/company" },
            { action: this.getOrganization, method: "get", endPoint: "/organization/:email" },
            { action: this.updateOrganization, method: "put", endPoint: "/organization/:id" },
        ];
    }

    
    updateOrganization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Organizations Not Implemented");
    }
    getOrganization = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await blockChainNetwork.registries.organization.getAll();
        let organization = resources.map((resource => new OrganizationModel(resource))).find(o => o.credentials.email == req.params.email)
        res.send(organization);
    }
    getOrganizations = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await blockChainNetwork.registries.organization.getAll();
        res.send(resources.map((resource => new OrganizationModel(resource))));
    }
    getEducationOrgs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await blockChainNetwork.businessNetworkConnection.query("getEducationOrganizations");
        res.send(resources.map((resource => new OrganizationModel(resource))));
    }
    getCompanyOrgs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let resources = await blockChainNetwork.businessNetworkConnection.query("getCompanyOrganizations");
        res.send(resources.map((resource => new OrganizationModel(resource))));
    }
}