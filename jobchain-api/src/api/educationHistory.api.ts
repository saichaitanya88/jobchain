import * as express from "express";
import * as rx from "rxjs";
import * as HttpStatus from "http-status-codes";

import { LocalApi } from "./index";
import { AssetRegistry } from "composer-client";
import { blockChainNetwork } from "../blockChainNetwork";
import { EducationHistoryModel, PersonModel, OrganizationModel } from "../models/index";

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
            let { resource, educationHistory } = await this.getNewResourceFromModel(req.body);
            if (resource) {
                await blockChainNetwork.registries.educationHistory.add(resource);
                res.status(HttpStatus.CREATED).send(educationHistory);
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
                res.status(HttpStatus.BAD_REQUEST).send("EducationHistory is not valid");
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
            else {
                res.status(HttpStatus.BAD_REQUEST).send("Invalid personOrOrg parameter")
            }
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error, errorMessage: error.toString() });
        }
    }

    async getPersonEducationHistories(personId: string) {
        let personResourceId = `resource:ca.jobchain.Person#${personId}`;
        let resources = await blockChainNetwork.businessNetworkConnection.query("getPersonEducationHistory", { ownerId: personResourceId });
        let results = [];
        for (let i = 0; i < resources.length; i++){
            let result = await this.getModelFromResource(resources[i]);
            results.push(result);
        }
        return results;
    }

    async getOrgEducationHistories(organizationId: string) {
        let orgResourceId = `resource:ca.jobchain.Organization#${organizationId}`;
        let resources = await blockChainNetwork.businessNetworkConnection.query("getOrganizationEducationHistory", { organizationId: orgResourceId });
        let results = [];
        for (let i = 0; i < resources.length; i++){
            let result = await this.getModelFromResource(resources[i]);
            results.push(result);
        }
        return results;
    }

    getEducationHistory = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(HttpStatus.NOT_IMPLEMENTED).send("Get WorkHistories not Implemented");
    }

    async getModelFromResource(resource: any) {
        let educationHistory = new EducationHistoryModel({ ...resource, educationHistoryId: resource.$identifier });
        let owner = await blockChainNetwork.registries.person.get(resource.owner.$identifier);
        educationHistory.owner = new PersonModel({ ...owner, personId: resource.owner.$identifier });
        let organization = await blockChainNetwork.registries.organization.get(resource.organization.$identifier);
        educationHistory.organization = new OrganizationModel({ ...organization, organizationId: resource.organization.$identifier });
        return educationHistory;
    }

    async getNewResourceFromModel(model: EducationHistoryModel) {
        let educationHistory = new EducationHistoryModel(model);
        if (!educationHistory.isValid()) return null;

        let resource = blockChainNetwork.factory.newResource('ca.jobchain', 'EducationHistory', educationHistory.educationHistoryId);
        resource.description = educationHistory.description;
        resource.verified = educationHistory.verified;
        resource.title = educationHistory.title;
        resource.endDate = educationHistory.endDate;
        resource.startDate = educationHistory.startDate;
        resource.owner = blockChainNetwork.factory.newRelationship("ca.jobchain", "Person", educationHistory.ownerId);
        resource.organization = blockChainNetwork.factory.newRelationship("ca.jobchain", "Organization", educationHistory.organizationId);

        return { resource, educationHistory };
    }
    updateResourceFromModel(educationHistory: EducationHistoryModel, resource: any) {
        resource.description = educationHistory.description;
        resource.verified = educationHistory.verified;
        resource.title = educationHistory.title;
        resource.endDate = educationHistory.endDate;
        resource.startDate = educationHistory.startDate;
        return resource;
    }
}