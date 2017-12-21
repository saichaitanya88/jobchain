//Thank to: http://onelinefun.com/
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
var quotes_core_api_1 = require("../../core/api/quotes.core.api");
var local_api_1 = require("./local.api");
var QuotesApi = (function (_super) {
    __extends(QuotesApi, _super);
    function QuotesApi() {
        var _this = _super.call(this) || this;
        _this.getQuotes = function (req, res, next) {
            quotes_core_api_1.getQuotes(_this.expressToAws(req))
                .subscribe(function (records) { return res.status(HttpStatus.OK).send(records); }, function (error) { return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error); });
        };
        _this.initializeRoutes();
        return _this;
    }
    QuotesApi.prototype.initializeRoutes = function () {
        this.router.get("/", this.getQuotes);
    };
    return QuotesApi;
}(local_api_1.LocalApi));
exports.QuotesApi = QuotesApi;
//# sourceMappingURL=quotes.local.api.js.map