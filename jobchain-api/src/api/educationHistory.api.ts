import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";

import { LocalApi } from "./index";
import { AssetRegistry } from "composer-client";
import { blockChainNetwork } from "../blockChainNetwork";
import { EducationHistoryModel } from "../models/index";

export class EducationHistoryApi extends LocalApi {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.routes = [
            { endPoint: "/education-history/:personOrOrg/:id", method: "get", action: this.getEducationHistories },
            { endPoint: "/education-history", method: "post", action: this.createEducationHistory },
            { endPoint: "/education-history/:id", method: "put", action: this.updateEducationHistory },
        ]
    }

    createEducationHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let { resource, workHistory } = await this.getNewResourceFromModel(req.body);
            if (resource) {
                await blockChainNetwork.registries.educationHistory.add(resource);
                res.status(HttpStatus.CREATED).send(workHistory);
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).send("EducationHistory is invalid");
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    updateEducationHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let educationHistory = new EducationHistoryModel(req.body);
            if (!educationHistory.isValid()) {
                res.status(HttpStatus.BAD_REQUEST).send("WorkHistory is not valid");
                return;
            }
            // TODO: blockchain should validate that the user requesting the update is authorized to make the update
            let resource = await blockChainNetwork.registries.educationHistory.get(educationHistory.educationHistoryId);
            resource = this.updateResourceFromModel(educationHistory, resource);
            await blockChainNetwork.registries.educationHistory.update(resource);
            res.status(HttpStatus.OK).send(educationHistory);
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }
    // TODO: Convert the array filters to block chain network query
    getEducationHistories = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let type = req.params.personOrOrg;
        try {
            if (type == "person") {
                let educationHistories = await this.getPersonEducationHistories(req.params.id);
                res.send(educationHistories)
            }
            else if (type == "organization") {
                let educationHistories = await this.getOrgEducationHistories(req.params.id)
                res.send(educationHistories)
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
    async getPersonEducationHistories(personId: string) {
        let educationHistoryResources = await blockChainNetwork.registries.educationHistory.getAll();
        let educationHistories: EducationHistoryModel[] = educationHistoryResources.map(r => this.getModelFromResource(r));
        return educationHistories.filter(w => w.ownerId == personId);
    }
    async getOrgEducationHistories(organizationId: string) {
        let workHistoryResources = await blockChainNetwork.registries.educationHistory.getAll();
        let workHistories: EducationHistoryModel[] = workHistoryResources.map(r => this.getModelFromResource(r));
        console.log(workHistories);
        return workHistories.filter(w => w.organizationId == organizationId);
    }

    getEducationHistory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get WorkHistories not Implemented");
    }

    getModelFromResource(resource: any){
        let workHistory = new EducationHistoryModel(resource);
        workHistory.organization.organizationId = resource.organization.$identifier;
        workHistory.owner.personId = resource.owner.$identifier;
        workHistory.educationHistoryId = resource.$identifier;
        return workHistory;
    }

    async getNewResourceFromModel(model: EducationHistoryModel) {
        let workHistory = new EducationHistoryModel(model);
        if (!workHistory.isValid()) return null;

        let resource = blockChainNetwork.factory.newResource('ca.jobchain', 'WorkHistory', workHistory.educationHistoryId);
        resource.description = workHistory.description;
        resource.verified = workHistory.verified;
        resource.title = workHistory.title;
        resource.endDate = workHistory.endDate;
        resource.startDate = workHistory.startDate;
        resource.owner = blockChainNetwork.factory.newRelationship("ca.jobchain", "Person", workHistory.ownerId);
        resource.organization = blockChainNetwork.factory.newRelationship("ca.jobchain", "Organization", workHistory.organizationId);

        return { resource, workHistory };
    }
    updateResourceFromModel(workHistory: EducationHistoryModel, resource: any) {
        resource.description = workHistory.description;
        resource.verified = workHistory.verified;
        resource.title = workHistory.title;
        resource.endDate = workHistory.endDate;
        resource.startDate = workHistory.startDate;
        return resource;
    }
}