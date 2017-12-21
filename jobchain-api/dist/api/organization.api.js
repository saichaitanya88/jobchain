"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus = require("http-status-codes");
var index_1 = require("./index");
var blockChainNetwork_1 = require("../blockChainNetwork");
var index_2 = require("../models/index");
var OrganizationApi = (function (_super) {
    __extends(OrganizationApi, _super);
    function OrganizationApi() {
        var _this = _super.call(this) || this;
        _this.createOrganization = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, resource, organization, orgExists, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = this.getResourceFromModel(req.body), resource = _a.resource, organization = _a.organization;
                        if (!resource) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.organizationExists(organization)];
                    case 1:
                        orgExists = _b.sent();
                        if (!orgExists) return [3 /*break*/, 2];
                        res.status(HttpStatus.BAD_REQUEST).send("Organization is invalid");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.organizationRegistry.add(resource)];
                    case 3:
                        _b.sent();
                        res.status(HttpStatus.CREATED).send(organization);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        res.status(HttpStatus.BAD_REQUEST).send("Organization is invalid");
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        console.error(error_1);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error_1, errorMessage: error_1.toString() });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        _this.updateOrganization = function (req, res, next) {
            res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Organizations Not Implemented");
        };
        _this.getOrganization = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var resources, organization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRegistry.getAll()];
                    case 1:
                        resources = _a.sent();
                        organization = resources.map((function (resource) { return new index_2.OrganizationModel(resource); })).find(function (o) { return o.credentials.email == req.params.email; });
                        res.send(organization);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.getOrganizations = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var resources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRegistry.getAll()];
                    case 1:
                        resources = _a.sent();
                        res.send(resources.map((function (resource) { return new index_2.OrganizationModel(resource); })));
                        return [2 /*return*/];
                }
            });
        }); };
        _this.initializeRoutes();
        _this.initRegistry();
        return _this;
    }
    OrganizationApi.prototype.initializeRoutes = function () {
        this.routes = [
            { action: this.getOrganizations, method: "get", endPoint: "/organizations" },
            { action: this.createOrganization, method: "post", endPoint: "/organization" },
            { action: this.getOrganization, method: "get", endPoint: "/organization/:email" },
            { action: this.updateOrganization, method: "put", endPoint: "/organization/:id" },
        ];
    };
    OrganizationApi.prototype.initRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockChainNetwork_1.blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Organization")];
                    case 1:
                        _a.organizationRegistry = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrganizationApi.prototype.getResourceFromModel = function (model) {
        var organization = new index_2.OrganizationModel(model);
        if (!organization.isValid())
            return null;
        var resource = blockChainNetwork_1.blockChainNetwork.factory.newResource('ca.jobchain', 'Organization', organization.organizationId);
        resource.name = organization.name;
        resource.description = organization.description;
        resource.verified = organization.verified;
        resource.credentials = blockChainNetwork_1.blockChainNetwork.factory.newConcept("ca.jobchain", "Credentials");
        resource.credentials.email = organization.credentials.email;
        resource.credentials.password = organization.credentials.password;
        resource.address = blockChainNetwork_1.blockChainNetwork.factory.newConcept("ca.jobchain", "Address");
        resource.address.address = organization.address.address;
        resource.organizationTypes = organization.organizationTypes.map(function (org) { return index_2.OrganizationTypeModel[org]; });
        return { resource: resource, organization: organization };
    };
    //TODO: This should be validated directly on the blockchain network using the cto
    OrganizationApi.prototype.organizationExists = function (organization) {
        return __awaiter(this, void 0, void 0, function () {
            var allResources, allOrgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.organizationRegistry.getAll()];
                    case 1:
                        allResources = _a.sent();
                        allOrgs = allResources.map(function (r) { return new index_2.OrganizationModel(r); });
                        return [2 /*return*/, allOrgs.some(function (o) { return o.credentials.email == organization.credentials.email; })];
                }
            });
        });
    };
    return OrganizationApi;
}(index_1.LocalApi));
exports.OrganizationApi = OrganizationApi;
//# sourceMappingURL=organization.api.js.map