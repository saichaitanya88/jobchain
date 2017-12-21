"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var environment_1 = require("../environment");
var LocalApi = (function () {
    function LocalApi() {
        this.router = express.Router();
    }
    LocalApi.prototype.expressToAws = function (req) {
        return {
            body: req.body,
            headers: req.headers,
            httpMethod: req.method,
            isBase64Encoded: false,
            path: req.path,
            pathParameters: req.params,
            queryStringParameters: req.query,
            requestContext: null,
            resource: null,
            stageVariables: environment_1.environment
        };
    };
    return LocalApi;
}());
exports.LocalApi = LocalApi;
//# sourceMappingURL=local.api.js.map