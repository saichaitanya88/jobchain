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
var AuthApi = (function (_super) {
    __extends(AuthApi, _super);
    function AuthApi() {
        var _this = _super.call(this) || this;
        // TODO: authenticate using Query rather than array filtering
        _this.authenticate = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var persons, person, organizations, organization, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.personRegistry.getAll()];
                    case 1:
                        persons = _a.sent();
                        person = persons.find(function (p) { return p.credentials.email == req.body.email && p.credentials.password == req.body.password; });
                        if (person) {
                            res.send(new index_2.PersonModel(person));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.organizationRegistry.getAll()];
                    case 2:
                        organizations = _a.sent();
                        organization = organizations.find(function (o) { return o.credentials.email == req.body.email && o.credentials.password == req.body.password; });
                        if (organization) {
                            res.send(new index_2.OrganizationModel(organization));
                            return [2 /*return*/];
                        }
                        res.status(HttpStatus.BAD_REQUEST).send();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error_1, errorMessage: error_1.toString() });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.initializeRoutes();
        _this.initRegistry();
        return _this;
    }
    AuthApi.prototype.initializeRoutes = function () {
        this.routes = [
            { action: this.authenticate, method: "post", endPoint: "/authenticate" }
        ];
    };
    // TODO: move registry to blockChainNetwork object, and reuse same reference rather than creating a reference in each Api controller
    AuthApi.prototype.initRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, blockChainNetwork_1.blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Organization")];
                    case 1:
                        _a.organizationRegistry = _c.sent();
                        _b = this;
                        return [4 /*yield*/, blockChainNetwork_1.blockChainNetwork.businessNetworkConnection.getParticipantRegistry("ca.jobchain.Person")];
                    case 2:
                        _b.personRegistry = _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthApi;
}(index_1.LocalApi));
exports.AuthApi = AuthApi;
//# sourceMappingURL=auth.api.js.map