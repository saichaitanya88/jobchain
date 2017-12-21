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
var org_hyperledger_composer_system_1 = require("./org.hyperledger.composer.system");
var org_hyperledger_composer_system_2 = require("./org.hyperledger.composer.system");
// export namespace ca.jobchain{
var Credentials = (function () {
    function Credentials() {
    }
    return Credentials;
}());
exports.Credentials = Credentials;
var Address = (function () {
    function Address() {
    }
    return Address;
}());
exports.Address = Address;
var OrganizationType;
(function (OrganizationType) {
    OrganizationType[OrganizationType["Company"] = 0] = "Company";
    OrganizationType[OrganizationType["Education"] = 1] = "Education";
})(OrganizationType = exports.OrganizationType || (exports.OrganizationType = {}));
var Person = (function (_super) {
    __extends(Person, _super);
    function Person() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Person;
}(org_hyperledger_composer_system_2.Participant));
exports.Person = Person;
var Organization = (function (_super) {
    __extends(Organization, _super);
    function Organization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Organization;
}(org_hyperledger_composer_system_2.Participant));
exports.Organization = Organization;
var WorkHistory = (function (_super) {
    __extends(WorkHistory, _super);
    function WorkHistory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WorkHistory;
}(org_hyperledger_composer_system_1.Asset));
exports.WorkHistory = WorkHistory;
var EducationHistory = (function (_super) {
    __extends(EducationHistory, _super);
    function EducationHistory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EducationHistory;
}(org_hyperledger_composer_system_1.Asset));
exports.EducationHistory = EducationHistory;
// }
//# sourceMappingURL=ca.jobchain.js.map