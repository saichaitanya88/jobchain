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
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus = require("http-status-codes");
var jokesCoreApi = require("../../core/api/jokes.core.api");
var local_api_1 = require("./local.api");
var JokesApi = (function (_super) {
    __extends(JokesApi, _super);
    function JokesApi() {
        var _this = _super.call(this) || this;
        _this.getJokes = function (req, res, next) {
            jokesCoreApi.getJokes(_this.expressToAws(req))
                .subscribe(function (records) { return res.status(HttpStatus.OK).send(records); }, function (error) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error); });
        };
        _this.createJoke = function (req, res, next) {
            jokesCoreApi.createJoke(_this.expressToAws(req))
                .subscribe(function (record) { return res.status(HttpStatus.OK).send(record); }, function (error) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error); });
        };
        _this.getRandomJoke = function (req, res, next) {
            jokesCoreApi.getRandomJoke(_this.expressToAws(req))
                .subscribe(function (records) { return res.status(HttpStatus.OK).send(records); }, function (error) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error); });
        };
        _this.initializeRoutes();
        return _this;
    }
    JokesApi.prototype.initializeRoutes = function () {
        this.router.get("/", this.getJokes);
        this.router.post("/", this.createJoke);
        this.router.get("/random", this.getRandomJoke);
    };
    return JokesApi;
}(local_api_1.LocalApi));
exports.JokesApi = JokesApi;
//# sourceMappingURL=jokes.local.api.js.map