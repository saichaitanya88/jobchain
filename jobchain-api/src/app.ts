import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import * as jwt from "jsonwebtoken";
import * as HttpStatus from "http-status-codes";
import { BusinessNetworkConnection } from "composer-client";
import { BusinessNetworkDefinition } from "composer-admin";

import { PersonApi } from "./api/person.api";
import { RouteDefinition } from './api/index';
import { OrganizationApi } from './api/organization.api';
import { WorkHistoryApi } from './api/workHistory.api';
import { AuthApi } from "./api/auth.api";
import { EducationHistoryApi } from "./api/educationHistory.api";
import { environment } from './environment';

// Creates and configures an ExpressJS web server.
export class App {
    // ref to Express instance
    public express: express.Application;
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.send({ message: "OK" });
        });
        let personApi = new PersonApi();
        let organizationApi = new OrganizationApi();
        let workHistoryApi = new WorkHistoryApi();
        let educationHistoryApi = new EducationHistoryApi();
        let authApi = new AuthApi();
        this.attachEndpoints(router, personApi.routes, this.authJwt);
        this.attachEndpoints(router, organizationApi.routes, this.authJwt);
        this.attachEndpoints(router, workHistoryApi.routes, this.authJwt);
        this.attachEndpoints(router, educationHistoryApi.routes, this.authJwt);
        this.attachEndpoints(router, authApi.routes, this.emptyAuthJwt);
        this.express.use('/api', router);

        this.express.use(express.static('www'));
    }

    private emptyAuthJwt(req: express.Request, res: express.Response, next: express.NextFunction, action: Function){
        action(req, res, next);
    }

    private authJwt(req: express.Request, res: express.Response, next: express.NextFunction, action: Function){
        let token: string = <string>req.headers.token;
        if (!token){
            res.status(HttpStatus.UNAUTHORIZED).send();
            return;
        }
        let verification = jwt.verify(token, environment.secret);
        if (verification){
            action(req, res, next);
        }
        else{
            res.status(HttpStatus.UNAUTHORIZED).send();
        }
    }

    private attachEndpoints(router: express.Router, routes: RouteDefinition[], auth: (req: express.Request, res: express.Response, next: express.NextFunction, action: Function) => void) {
        routes.forEach(route => {
            router[route.method](route.endPoint, (req: express.Request, res: express.Response, next: express.NextFunction) => {
                auth(req, res, next, route.action);
            });
            console.log("added endpoint", route.method.toUpperCase(), route.endPoint);
        })
    }
}