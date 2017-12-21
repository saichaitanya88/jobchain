// Thanks to: https://github.com/mjhea0/typescript-node-api
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var jokes_local_api_1 = require("./api/jokes.local.api");
var quotes_local_api_1 = require("./api/quotes.local.api");
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
            res.send({ message: "This is the base route of your api" });
        });
        this.express.use('/api', router);
        this.express.use("/api/jokes", new jokes_local_api_1.JokesApi().router);
        this.express.use("/api/quotes", new quotes_local_api_1.QuotesApi().router);
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=app.js.map