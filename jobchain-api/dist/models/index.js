"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ca_jobchain_1 = require("./ca.jobchain");
var CredentialsModel = (function () {
    function CredentialsModel() {
    }
    return CredentialsModel;
}());
exports.CredentialsModel = CredentialsModel;
var PersonModel = (function () {
    function PersonModel(source) {
        this.credentials = new CredentialsModel();
        this.personId = source ? source.personId : "";
        this.firstName = source ? source.firstName : "";
        this.lastName = source ? source.lastName : "";
        this.phone = source ? source.phone : "";
        this.description = source ? source.description : "";
        this.credentials.email = source && source.credentials ? source.credentials.email : "";
        this.credentials.password = source && source.credentials ? source.credentials.password : "";
    }
    PersonModel.prototype.isValid = function () {
        var validEmailRegEx = /^.+@.+$/i;
        var emailFormatValid = this.credentials && this.credentials.email && validEmailRegEx.test(this.credentials.email);
        return this.firstName && this.lastName && this.personId &&
            this.credentials && this.credentials.password && this.credentials.email &&
            emailFormatValid && true;
    };
    return PersonModel;
}());
exports.PersonModel = PersonModel;
var AddressModel = (function () {
    function AddressModel() {
    }
    AddressModel.prototype.isValid = function () {
        return !!this.address;
    };
    return AddressModel;
}());
exports.AddressModel = AddressModel;
exports.OrganizationTypeModel = ca_jobchain_1.OrganizationType;
var OrganizationModel = (function () {
    function OrganizationModel(source) {
        this.address = new AddressModel();
        this.credentials = new CredentialsModel();
        this.address.address = source && source.address ? source.address.address : "";
        this.credentials.email = source && source.credentials ? source.credentials.email : "";
        this.credentials.password = source && source.credentials ? source.credentials.password : "";
        this.organizationTypes = source ? source.organizationTypes : [];
        this.name = source ? source.name : "";
        this.organizationId = source ? source.organizationId : "";
        this.description = source ? source.description : "";
        this.verified = (source ? source.verified : false) || false;
    }
    OrganizationModel.prototype.isValid = function () {
        return true;
    };
    return OrganizationModel;
}());
exports.OrganizationModel = OrganizationModel;
var WorkHistoryModel = (function () {
    function WorkHistoryModel(source) {
        this.workHistoryId = source ? source.workHistoryId : null;
        this.owner = source ? new PersonModel(source.owner) : null;
        this.organization = source ? new OrganizationModel(source.organization) : null;
        this.title = source ? source.title : "";
        this.description = source ? source.description : "";
        this.startDate = source && source.startDate ? new Date(source.startDate) : null;
        this.endDate = source && source.endDate ? new Date(source.endDate) : null;
        this.verified = (source ? source.verified : false) || false;
    }
    Object.defineProperty(WorkHistoryModel.prototype, "ownerId", {
        get: function () {
            return this.owner ? this.owner.personId : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkHistoryModel.prototype, "organizationId", {
        get: function () {
            return this.organization ? this.organization.organizationId : null;
        },
        enumerable: true,
        configurable: true
    });
    WorkHistoryModel.prototype.isValid = function () {
        return this.ownerId && this.organization && this.workHistoryId && this.title && this.description && this.startDate;
    };
    return WorkHistoryModel;
}());
exports.WorkHistoryModel = WorkHistoryModel;
var EducationHistoryModel = (function () {
    function EducationHistoryModel(source) {
        this.educationHistoryId = source ? source.educationHistoryId : null;
        this.owner = source ? new PersonModel(source.owner) : null;
        this.organization = source ? new OrganizationModel(source.organization) : null;
        this.title = source ? source.title : "";
        this.description = source ? source.description : "";
        this.startDate = source && source.startDate ? new Date(source.startDate) : null;
        this.endDate = source && source.endDate ? new Date(source.endDate) : null;
        this.verified = (source ? source.verified : false) || false;
    }
    Object.defineProperty(EducationHistoryModel.prototype, "ownerId", {
        get: function () {
            return this.owner ? this.owner.personId : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EducationHistoryModel.prototype, "organizationId", {
        get: function () {
            return this.organization ? this.organization.organizationId : null;
        },
        enumerable: true,
        configurable: true
    });
    EducationHistoryModel.prototype.isValid = function () {
        console.log("this.organization", this.organization);
        return this.ownerId && this.organization && this.educationHistoryId && this.title && this.description && this.startDate;
    };
    return EducationHistoryModel;
}());
exports.EducationHistoryModel = EducationHistoryModel;
//# sourceMappingURL=index.js.map