"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composer_client_1 = require("composer-client");
var rx = require("rxjs");
var BlockChainNetwork = (function () {
    function BlockChainNetwork() {
        this.cardName = "admin@jobchain";
        this.networkIdentifier = 'jobchain@0.0.1';
    }
    BlockChainNetwork.prototype.connect = function () {
        var _this = this;
        return rx.Observable.create(function (obs) {
            _this.businessNetworkConnection = new composer_client_1.BusinessNetworkConnection();
            _this.businessNetworkConnection.connect(_this.cardName)
                .then(function (result) {
                _this.businessNetworkDefinition = result;
                console.info("Connected to", _this.businessNetworkDefinition.getName());
                _this.factory = _this.businessNetworkDefinition.getFactory();
                obs.next(true);
                obs.complete();
            }).catch(function (error) {
                console.error(error);
                process.abort();
            });
        });
    };
    return BlockChainNetwork;
}());
exports.blockChainNetwork = new BlockChainNetwork();
//# sourceMappingURL=blockChainNetwork.js.map