import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";

import { LocalApi } from "./index";
import { AssetRegistry } from "composer-client";
import { blockChainNetwork } from "../blockChainNetwork";
import { WorkHistoryModel } from "../models/index";

export class WorkHistoryApi extends LocalApi {
    workHistoryRegistry: AssetRegistry;

    constructor() {
        super();
        this.initializeRoutes();
        this.initRegistry();
    }
    initializeRoutes() {
        this.routes = [
            { endPoint: "/work-history/:personOrOrg/:id", method: "get", action: this.getWorkHistories },
            { endPoint: "/work-history", method: "post", action: this.createWorkHistory },
            { endPoint: "/work-history/:id", method: "put", action: this.updateWorkHistory },
        ]
    }
    async initRegistry() {
        this.workHistoryRegistry = await blockChainNetwork.businessNetworkConnection.getAssetRegistry("ca.jobchain.WorkHistory");
    }
    createWorkHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, workHistory } = await this.getNewResourceFromModel(req.body);
            if (resource) {
                await this.workHistoryRegistry.add(resource);
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
            let resource = await this.workHistoryRegistry.get(workHistory.workHistoryId);
            resource = this.updateResourceFromModel(workHistory, resource);
            await this.workHistoryRegistry.update(resource);
            res.status(HttpStatus.OK).send(workHistory);
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    // TODO: Convert the array filters to block chain network query
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
            else{
                res.status(HttpStatus.BAD_REQUEST).send("Invalid personOrOrg parameter")
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    async getPersonWorkHistories(personId: string) {
        let workHistoryResources = await this.workHistoryRegistry.getAll();
        let workHistories: WorkHistoryModel[] = workHistoryResources.map(r => this.getModelFromResource(r));
        return workHistories.filter(w => w.ownerId == personId);
    }
    async getOrgWorkHistories(organizationId: string) {
        let workHistoryResources = await this.workHistoryRegistry.getAll();
        let workHistories: WorkHistoryModel[] = workHistoryResources.map(r => this.getModelFromResource(r));
        console.log(workHistories);
        return workHistories.filter(w => w.organizationId == organizationId);
    }
    getWorkHistory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get WorkHistories not Implemented");
    }

    getModelFromResource(resource: any){
        let workHistory = new WorkHistoryModel(resource);
        // TODO: provide owner and organization models as well rather than just the identifiers
        workHistory.organization.organizationId = resource.organization.$identifier;
        workHistory.owner.personId = resource.owner.$identifier;
        workHistory.workHistoryId = resource.$identifier;
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
    workHistoryExists() {

    }
}