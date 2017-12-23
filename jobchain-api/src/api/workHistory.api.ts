import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";

import { LocalApi } from "./index";
import { AssetRegistry } from "composer-client";
import { blockChainNetwork } from "../blockChainNetwork";
import { WorkHistoryModel, PersonModel, OrganizationModel } from "../models/index";
import { WorkHistory } from "../models/ca.jobchain";

export class WorkHistoryApi extends LocalApi {

    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { endPoint: "/work-history/:personOrOrg/:id", method: "get", action: this.getWorkHistories },
            { endPoint: "/work-history", method: "post", action: this.createWorkHistory },
            { endPoint: "/work-history/:id", method: "put", action: this.updateWorkHistory },
        ]
    }
    createWorkHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, workHistory } = await this.getNewResourceFromModel(req.body);
            if (resource) {
                await blockChainNetwork.registries.workHistory.add(resource);
                res.status(HttpStatus.CREATED).send(workHistory);
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).send("WorkHistory is not valid");
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    updateWorkHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let workHistory = new WorkHistoryModel(req.body);
            if (!workHistory.isValid()) {
                res.status(HttpStatus.BAD_REQUEST).send("WorkHistory is not valid");
                return;
            }
            // TODO: blockchain should validate that the user requesting the update is authorized to make the update
            let resource = await blockChainNetwork.registries.workHistory.get(workHistory.workHistoryId);
            resource = this.updateResourceFromModel(workHistory, resource);
            await blockChainNetwork.registries.workHistory.update(resource);
            res.status(HttpStatus.OK).send(workHistory);
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }

    getWorkHistories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let type = req.params.personOrOrg;
        try {
            if (type == "person") {
                let workHistories = await this.getPersonWorkHistories(req.params.id);
                res.send(workHistories)
            }
            else if (type == "organization") {
                let workHistories = await this.getOrgWorkHistories(req.params.id)
                res.send(workHistories)
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).send("Invalid personOrOrg parameter")
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }

    async getPersonWorkHistories(personId: string) {
        let personResourceId = `resource:ca.jobchain.Person#${personId}`;
        let resources = await blockChainNetwork.businessNetworkConnection.query("getPersonWorkHistory", { ownerId: personResourceId });
        let results = [];
        for (let i = 0; i < resources.length; i++){
            let result = await this.getModelFromResource(resources[i]);
            results.push(result);
        }
        return results;
    }

    async getOrgWorkHistories(organizationId: string) {
        let orgResourceId = `resource:ca.jobchain.Organization#${organizationId}`;
        let resources = await blockChainNetwork.businessNetworkConnection.query("getOrganizationWorkHistory", { organizationId: orgResourceId });
        let results = [];
        for (let i = 0; i < resources.length; i++){
            let result = await this.getModelFromResource(resources[i]);
            results.push(result);
        }
        return results;
    }

    getWorkHistory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get WorkHistories not Implemented");
    }

    // TODO: use resolve instead of retrieving the org and owner separately
    async getModelFromResource(resource: any) {
        let workHistory = new WorkHistoryModel({...resource, workHistoryId: resource.$identifier});
        let owner = await blockChainNetwork.registries.person.get(resource.owner.$identifier);
        workHistory.owner = new PersonModel({ ...owner, personId: resource.owner.$identifier });
        let organization = await blockChainNetwork.registries.organization.get(resource.organization.$identifier);
        workHistory.organization = new OrganizationModel({ ...organization, organizationId: resource.organization.$identifier });
        return workHistory;
    }

    async getNewResourceFromModel(model: WorkHistoryModel) {
        let workHistory = new WorkHistoryModel(model);
        if (!workHistory.isValid()) return null;

        let resource = blockChainNetwork.factory.newResource('ca.jobchain', 'WorkHistory', workHistory.workHistoryId);
        resource.description = workHistory.description;
        resource.verified = workHistory.verified;
        resource.title = workHistory.title;
        resource.endDate = workHistory.endDate;
        resource.startDate = workHistory.startDate;
        resource.owner = blockChainNetwork.factory.newRelationship("ca.jobchain", "Person", workHistory.ownerId);
        resource.organization = blockChainNetwork.factory.newRelationship("ca.jobchain", "Organization", workHistory.organizationId);

        return { resource, workHistory };
    }
    updateResourceFromModel(workHistory: WorkHistoryModel, resource: any) {
        resource.description = workHistory.description;
        resource.verified = workHistory.verified;
        resource.title = workHistory.title;
        resource.endDate = workHistory.endDate;
        resource.startDate = workHistory.startDate;
        return resource;
    }
}