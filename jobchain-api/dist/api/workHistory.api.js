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
var WorkHistoryApi = (function (_super) {
    __extends(WorkHistoryApi, _super);
    function WorkHistoryApi() {
        var _this = _super.call(this) || this;
        _this.createWorkHistory = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, resource, workHistory, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getNewResourceFromModel(req.body)];
                    case 1:
                        _a = _b.sent(), resource = _a.resource, workHistory = _a.workHistory;
                        if (!resource) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.workHistoryRegistry.add(resource)];
                    case 2:
                        _b.sent();
                        res.status(HttpStatus.CREATED).send(workHistory);
                        return [3 /*break*/, 4];
                    case 3:
                        res.status(HttpStatus.BAD_REQUEST).send("WorkHistory is not valid");
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.error(error_1);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error_1, errorMessage: error_1.toString() });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        _this.updateWorkHistory = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var workHistory, resource, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        workHistory = new index_2.WorkHistoryModel(req.body);
                        if (!workHistory.isValid()) {
                            res.status(HttpStatus.BAD_REQUEST).send("WorkHistory is not valid");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.workHistoryRegistry.get(workHistory.workHistoryId)];
                    case 1:
                        resource = _a.sent();
                        resource = this.updateResourceFromModel(workHistory, resource);
                        return [4 /*yield*/, this.workHistoryRegistry.update(resource)];
                    case 2:
                        _a.sent();
                        res.status(HttpStatus.OK).send(workHistory);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error_2, errorMessage: error_2.toString() });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // TODO: Convert the array filters to block chain network query
        _this.getWorkHistories = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var type, workHistories, workHistories, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = req.params.personOrOrg;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        if (!(type == "person")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getPersonWorkHistories(req.params.id)];
                    case 2:
                        workHistories = _a.sent();
                        res.send(workHistories);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(type == "organization")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getOrgWorkHistories(req.params.id)];
                    case 4:
                        workHistories = _a.sent();
                        res.send(workHistories);
                        return [3 /*break*/, 6];
                    case 5:
                        res.status(HttpStatus.BAD_REQUEST).send("Invalid personOrOrg parameter");
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.error(error_3);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error_3, errorMessage: error_3.toString() });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        _this.getWorkHistory = function (req, res, next) {
            res.status(HttpStatus.NOT_IMPLEMENTED).send("Get WorkHistories not Implemented");
        };
        _this.initializeRoutes();
        _this.initRegistry();
        return _this;
    }
    WorkHistoryApi.prototype.initializeRoutes = function () {
        this.routes = [
            { endPoint: "/work-history/:personOrOrg/:id", method: "get", action: this.getWorkHistories },
            { endPoint: "/work-history", method: "post", action: this.createWorkHistory },
            { endPoint: "/work-history/:id", method: "put", action: this.updateWorkHistory },
        ];
    };
    WorkHistoryApi.prototype.initRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockChainNetwork_1.blockChainNetwork.businessNetworkConnection.getAssetRegistry("ca.jobchain.WorkHistory")];
                    case 1:
                        _a.workHistoryRegistry = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WorkHistoryApi.prototype.getPersonWorkHistories = function (personId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var workHistoryResources, workHistories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.workHistoryRegistry.getAll()];
                    case 1:
                        workHistoryResources = _a.sent();
                        workHistories = workHistoryResources.map(function (r) { return _this.getModelFromResource(r); });
                        return [2 /*return*/, workHistories.filter(function (w) { return w.ownerId == personId; })];
                }
            });
        });
    };
    WorkHistoryApi.prototype.getOrgWorkHistories = function (organizationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var workHistoryResources, workHistories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.workHistoryRegistry.getAll()];
                    case 1:
                        workHistoryResources = _a.sent();
                        workHistories = workHistoryResources.map(function (r) { return _this.getModelFromResource(r); });
                        console.log(workHistories);
                        return [2 /*return*/, workHistories.filter(function (w) { return w.organizationId == organizationId; })];
                }
            });
        });
    };
    WorkHistoryApi.prototype.getModelFromResource = function (resource) {
        var workHistory = new index_2.WorkHistoryModel(resource);
        workHistory.organization.organizationId = resource.organization.$identifier;
        workHistory.owner.personId = resource.owner.$identifier;
        workHistory.workHistoryId = resource.$identifier;
        return workHistory;
    };
    WorkHistoryApi.prototype.getNewResourceFromModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var workHistory, resource;
            return __generator(this, function (_a) {
                workHistory = new index_2.WorkHistoryModel(model);
                if (!workHistory.isValid())
                    return [2 /*return*/, null];
                resource = blockChainNetwork_1.blockChainNetwork.factory.newResource('ca.jobchain', 'WorkHistory', workHistory.workHistoryId);
                resource.description = workHistory.description;
                resource.verified = workHistory.verified;
                resource.title = workHistory.title;
                resource.endDate = workHistory.endDate;
                resource.startDate = workHistory.startDate;
                resource.owner = blockChainNetwork_1.blockChainNetwork.factory.newRelationship("ca.jobchain", "Person", workHistory.ownerId);
                resource.organization = blockChainNetwork_1.blockChainNetwork.factory.newRelationship("ca.jobchain", "Organization", workHistory.organizationId);
                return [2 /*return*/, { resource: resource, workHistory: workHistory }];
            });
        });
    };
    WorkHistoryApi.prototype.updateResourceFromModel = function (workHistory, resource) {
        resource.description = workHistory.description;
        resource.verified = workHistory.verified;
        resource.title = workHistory.title;
        resource.endDate = workHistory.endDate;
        resource.startDate = workHistory.startDate;
        return resource;
    };
    WorkHistoryApi.prototype.workHistoryExists = function () {
    };
    return WorkHistoryApi;
}(index_1.LocalApi));
exports.WorkHistoryApi = WorkHistoryApi;
//# sourceMappingURL=workHistory.api.js.map