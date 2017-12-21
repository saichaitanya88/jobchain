"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var person_api_1 = require("./api/person.api");
var organization_api_1 = require("./api/organization.api");
var workHistory_api_1 = require("./api/workHistory.api");
var auth_api_1 = require("./api/auth.api");
var educationHistory_api_1 = require("./api/educationHistory.api");
// Creates and configures an ExpressJS web server.
var App = (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        var router = express.Router();
        // placeholder route handler
        router.get('/', function (req, res, next) {
            res.send({ message: "OK" });
        });
        var personApi = new person_api_1.PersonApi();
        var organizationApi = new organization_api_1.OrganizationApi();
        var workHistoryApi = new workHistory_api_1.WorkHistoryApi();
        var educationHistoryApi = new educationHistory_api_1.EducationHistoryApi();
        var authApi = new auth_api_1.AuthApi();
        this.attachEndpoints(router, personApi.routes);
        this.attachEndpoints(router, organizationApi.routes);
        this.attachEndpoints(router, workHistoryApi.routes);
        this.attachEndpoints(router, educationHistoryApi.routes);
        this.attachEndpoints(router, authApi.routes);
        this.express.use('/api', router);
    };
    App.prototype.attachEndpoints = function (router, routes) {
        routes.forEach(function (route) {
            router[route.method](route.endPoint, route.action);
            console.log("added endpoint", route.method.toUpperCase(), route.endPoint);
        });
    };
    return App;
}());
exports.App = App;
//export default new App().express; 
//# sourceMappingURL=app.js.map