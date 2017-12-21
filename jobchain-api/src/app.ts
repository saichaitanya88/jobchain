import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import { BusinessNetworkConnection } from "composer-client";
import { BusinessNetworkDefinition } from "composer-admin";

import { PersonApi } from "./api/person.api";
import { RouteDefinition } from './api/index';
import { OrganizationApi } from './api/organization.api';
import { WorkHistoryApi } from './api/workHistory.api';
import { AuthApi } from "./api/auth.api";
import { EducationHistoryApi } from "./api/educationHistory.api";

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
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.send({ message: "OK" });
        });
        let personApi = new PersonApi();
        let organizationApi = new OrganizationApi();
        let workHistoryApi = new WorkHistoryApi();
        let educationHistoryApi = new EducationHistoryApi();
        let authApi = new AuthApi();
        this.attachEndpoints(router, personApi.routes);
        this.attachEndpoints(router, organizationApi.routes);
        this.attachEndpoints(router, workHistoryApi.routes);
        this.attachEndpoints(router, educationHistoryApi.routes);
        this.attachEndpoints(router, authApi.routes);
        this.express.use('/api', router);
    }

    private attachEndpoints(router: express.Router, routes: RouteDefinition[]){
        routes.forEach(route => {
            router[route.method](route.endPoint, route.action);
            console.log("added endpoint", route.method.toUpperCase(), route.endPoint)
        })
    }
}



//export default new App().express;