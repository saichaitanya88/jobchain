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
var PersonApi = (function (_super) {
    __extends(PersonApi, _super);
    function PersonApi() {
        var _this = _super.call(this) || this;
        _this.createPerson = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, resource, person, personExists, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = this.getResourceFromModel(req.body), resource = _a.resource, person = _a.person;
                        if (!resource) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.personExists(person)];
                    case 1:
                        personExists = _b.sent();
                        if (!personExists) return [3 /*break*/, 2];
                        res.status(HttpStatus.BAD_REQUEST).send("Person is invalid");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.personRegistry.add(resource)];
                    case 3:
                        _b.sent();
                        res.status(HttpStatus.CREATED).send(person);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        res.status(HttpStatus.BAD_REQUEST).send("Person is invalid");
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
        _this.updatePerson = function (req, res, next) {
            res.status(HttpStatus.NOT_IMPLEMENTED).send("Update Person Not Implemented");
        };
        _this.getPerson = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var resources, person;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.personRegistry.getAll()];
                    case 1:
                        resources = _a.sent();
                        person = resources.map((function (resource) { return new index_2.PersonModel(resource); })).find(function (p) { return p.credentials.email == req.params.email; });
                        res.send(person);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.getPersons = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(HttpStatus.NOT_IMPLEMENTED).send("Get Persons Not Implemented");
                return [2 /*return*/];
            });
        }); };
        _this.initializeRoutes();
        _this.initRegistry();
        return _this;
    }
    PersonApi.prototype.initializeRoutes = function () {
        this.routes = [
            { action: this.getPersons, method: "get", endPoint: "/persons" },
            { action: this.createPerson, method: "post", endPoint: "/person" },
            { action: this.getPerson, method: "get", endPoint: "/person/:email" },
            { action: this.updatePerson, method: "put", endPoint: "/person/:id" }
        ];
    };
    PersonApi.prototype.initRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockChainNetwork_1.blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Person")];
                    case 1:
                        _a.personRegistry = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PersonApi.prototype.getResourceFromModel = function (model) {
        var person = new index_2.PersonModel(model);
        if (!person.isValid())
            return null;
        var resource = blockChainNetwork_1.blockChainNetwork.factory.newResource('ca.jobchain', 'Person', person.personId);
        resource.description = person.description;
        resource.firstName = person.firstName;
        resource.lastName = person.lastName;
        resource.phone = person.phone;
        resource.credentials = blockChainNetwork_1.blockChainNetwork.factory.newConcept("ca.jobchain", "Credentials");
        resource.credentials.email = person.credentials.email;
        resource.credentials.password = person.credentials.password;
        return { resource: resource, person: person };
    };
    //TODO: This should be validated directly on the blockchain network using the cto
    PersonApi.prototype.personExists = function (person) {
        return __awaiter(this, void 0, void 0, function () {
            var allResources, allPersons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.personRegistry.getAll()];
                    case 1:
                        allResources = _a.sent();
                        allPersons = allResources.map(function (r) { return new index_2.PersonModel(r); });
                        return [2 /*return*/, allPersons.some(function (p) { return p.credentials.email == person.credentials.email; })];
                }
            });
        });
    };
    return PersonApi;
}(index_1.LocalApi));
exports.PersonApi = PersonApi;
//# sourceMappingURL=person.api.js.map