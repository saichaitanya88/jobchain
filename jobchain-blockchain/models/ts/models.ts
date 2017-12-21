import { WorkHistory, Person, Credentials, Organization, Address, OrganizationType, EducationHistory } from "./ca.jobchain";

export class CredentialsModel implements Credentials {
    email: string;
    password: string;
    confirmPassword?: string;
}

export class PersonModel implements Person {
    personId: string;
    firstName: string;
    lastName: string;
    credentials: CredentialsModel;
    phone: string;
    description: string;
    constructor(source?: any) {
        this.credentials = new CredentialsModel();
        this.personId = source ? source.personId : null;
        this.firstName = source ? source.firstName : "";
        this.lastName = source ? source.lastName : "";
        this.phone = source ? source.phone : "";
        this.description = source ? source.description : "";
        this.credentials.email = source && source.credentials ? source.credentials.email : "";
        this.credentials.password = source && source.credentials ? source.credentials.password : "";
    }
    isValid() {
        return this.firstName && this.lastName && this.personId && this.credentials && this.credentials.password && this.credentials.email;
    }
}

export class AddressModel implements Address {
    address: string;
    isValid() {
        return !!this.address;
    }
}

export const OrganizationTypeModel = OrganizationType;

export class OrganizationModel implements Organization {
    organizationId: string;
    name: string;
    address: AddressModel;
    description: string;
    credentials: CredentialsModel;
    verified: boolean;
    organizationTypes: OrganizationType[];
    constructor(source?: any) {
        this.address = new AddressModel();
        this.credentials = new CredentialsModel();
        this.address.address = source && source.address ? source.address.address : "";
        this.credentials.email = source && source.credentials ? source.credentials.email : "";
        this.credentials.password = source && source.credentials ? source.credentials.password : "";
        this.organizationTypes = source && source.organizationTypes ? source.organizationTypes : [];
        this.name = source ? source.name : "";
        this.organizationId = source ? source.organizationId : null;
        this.description = source ? source.description : "";
        this.verified = (source ? source.verified : false) || false;
    }
    isValid() {
        return true;
    }
}

export class WorkHistoryModel implements WorkHistory {
    owner: PersonModel;
    organization: OrganizationModel;
    workHistoryId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    verified: boolean;

    constructor(source?: any) {
        this.workHistoryId = source ? source.workHistoryId : null;
        this.owner = source ? new PersonModel(source.owner) : null;
        this.organization = source ? new OrganizationModel(source.organization) : null;
        this.title = source ? source.title : "";
        this.description = source ? source.description : "";
        this.startDate = source && source.startDate ? new Date(source.startDate) : null;
        this.endDate = source && source.endDate ? new Date(source.endDate) : null;
        this.verified = (source ? source.verified : false) || false;
    }
    get ownerId() {
        return this.owner ? this.owner.personId : null;
    }
    get organizationId() {
        return this.organization ? this.organization.organizationId : null;
    }
    isValid() {
        console.log("this.organization", this.organization);
        return this.ownerId && this.organization && this.workHistoryId && this.title && this.description && this.startDate;
    }
}

export class EducationHistoryModel implements EducationHistory {
    educationHistoryId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    verified: boolean;
    owner: Person;
    organization: Organization;

    constructor(source?: any) {
        this.educationHistoryId = source ? source.educationHistoryId : null;
        this.owner = source ? new PersonModel(source.owner) : null;
        this.organization = source ? new OrganizationModel(source.organization) : null;
        this.title = source ? source.title : "";
        this.description = source ? source.description : "";
        this.startDate = source && source.startDate ? new Date(source.startDate) : null;
        this.endDate = source && source.endDate ? new Date(source.endDate) : null;
        this.verified = (source ? source.verified : false) || false;
    }
    get ownerId() {
        return this.owner ? this.owner.personId : null;
    }
    get organizationId() {
        return this.organization ? this.organization.organizationId : null;
    }
    isValid() {
        return this.ownerId && this.organization && this.educationHistoryId && this.title && this.description && this.startDate;
    }
}