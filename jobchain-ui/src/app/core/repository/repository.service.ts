import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { StorageService } from '../storage.service';
import { PersonModel, OrganizationModel, WorkHistoryModel, EducationHistoryModel, OrganizationTypeModel } from '../../models/index';


@Injectable()
export class RepositoryService {
    person: PersonRepository;
    organization: OrganizationRepository;
    workHistory: WorkHistoryRepository;
    educationHistory: EducationHistoryRepository;
    constructor(storageSerice: StorageService) {
        this.person = new PersonRepository(storageSerice);
        this.organization = new OrganizationRepository(storageSerice);
        this.educationHistory = new EducationHistoryRepository(storageSerice);
        this.workHistory = new WorkHistoryRepository(storageSerice);
    }

    // Queries
    login(email: string, password: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this.person.getPersons().subscribe(persons => {
                let person = persons.find(p => p.credentials.email == email && p.credentials.password == password);
                if (person) {
                    observer.next(person);
                    observer.complete();
                }
            });
            this.organization.getOrganizations().subscribe(orgs => {
                let org = orgs.find(o => o.credentials.email == email && o.credentials.password == password);
                if (org) {
                    observer.next(org);
                    observer.complete();
                }
            });
        });
    }

    getCompanies(): Observable<OrganizationModel[]> {
        return Observable.create((observer: Observer<OrganizationModel[]>) => {
            this.organization.getOrganizations().subscribe(orgs => {
                observer.next(orgs.filter(org => org.organizationTypes.includes(OrganizationTypeModel.Company)));
                observer.complete();
            });
        });
    }
    getInstitutions(): Observable<OrganizationModel[]> {
        return Observable.create((observer: Observer<OrganizationModel[]>) => {
            this.organization.getOrganizations().subscribe(orgs => {
                observer.next(orgs.filter(org => org.organizationTypes.includes(OrganizationTypeModel.Education)));
                observer.complete();
            });
        });
    }

}

export abstract class Repository {
    constructor(public storageSerice?: StorageService) { }
    abstract saveChanges();
}
export type SearchParams = { [key: string]: any };

export class PersonRepository extends Repository {
    persons: PersonModel[];
    constructor(storageService: StorageService) {
        super(storageService);
        let persons = <any>storageService.getItem("repository.persons") || [];
        this.persons = persons.map(p => new PersonModel(p));
    }
    createPerson(person: PersonModel) {
        let passwordMatch = person.credentials.password == person.credentials.confirmPassword;
        if (person.isValid() && passwordMatch) {
            this.persons.push(person);
            this.saveChanges();
            return Observable.of(person);
        }
        else {
            return <Observable<any>>Observable.throw(new Error("Person is not valid"));
        }
    }
    updatePerson(person: PersonModel) {
        let dbPerson = this.persons.find(p => p.personId == person.personId);
        if (!dbPerson)
            return <Observable<any>>Observable.throw(new Error("Person does not exist"));;

        dbPerson = person;
        if (dbPerson.isValid()) {
            this.saveChanges();
            Observable.of(person);
        }
        else
            return <Observable<any>>Observable.throw(new Error("Person is not valid"));
    }
    saveChanges() {
        this.storageSerice.setItem("repository.persons", this.persons);
    }
    getPerson(personId: string) {
        let person = this.persons.find(p => p.personId == personId);
        return Observable.of(person);
    }
    getPersons() {
        return Observable.create((observer: Observer<PersonModel[]>) => {
            observer.next(this.persons);
            observer.complete();
        });
    }
}

export class OrganizationRepository extends Repository {
    organizations: OrganizationModel[];
    constructor(storageService: StorageService) {
        super(storageService);
        let organizations = <any>storageService.getItem("repository.organizations") || [];
        this.organizations = organizations.map(o => new OrganizationModel(o));
    }
    saveChanges() {
        this.storageSerice.setItem("repository.organizations", this.organizations);
    }
    createOrganization(organization: OrganizationModel) {
        let passwordsMatch = organization.credentials.confirmPassword == organization.credentials.password;
        if (organization.isValid() && passwordsMatch) {
            this.organizations.push(organization);
            this.saveChanges();
            return Observable.of(organization);
        }
        else {
            return <Observable<any>>Observable.throw(new Error("Organization is not valid"));
        }
    }
    updateOrganization(organization: OrganizationModel) {
        let dbOrganization = this.organizations.find(p => p.organizationId == organization.organizationId);
        if (!dbOrganization)
            return <Observable<any>>Observable.throw(new Error("Organization does not exist"));
        dbOrganization = organization;
        if (dbOrganization.isValid()) {
            this.saveChanges();
            return Observable.of(organization);
        }
        else {
            return <Observable<any>>Observable.throw(new Error("Organization is not valid"));
        }
    }
    getOrganization(organizationId: string) {
        let organization = this.organizations.find(p => p.organizationId == organizationId);
        return Observable.of(organization);
    }
    getOrganizations(): Observable<OrganizationModel[]> {
        return Observable.create((observer: Observer<OrganizationModel[]>) => {
            observer.next(this.organizations);
            observer.complete();
        });
    }
}

export class WorkHistoryRepository extends Repository {
    workHistoryRecords: WorkHistoryModel[];
    constructor(storageService: StorageService) {
        super(storageService);
        let workHistoryRecords = <any>storageService.getItem("repository.workHistoryRecords") || [];
        this.workHistoryRecords = workHistoryRecords.map(w => new WorkHistoryModel(w));
    }
    saveChanges() {
        this.storageSerice.setItem("repository.workHistoryRecords", this.workHistoryRecords);
    }
    createWorkHistory(workHistory: WorkHistoryModel) {
        if (!workHistory.isValid())
            return <Observable<any>>Observable.throw(new Error("WorkHistory is not valid"));

        this.workHistoryRecords.push(workHistory);
        this.saveChanges();
        return Observable.of(workHistory);
    }
    updateWorkHistory(workHistory: WorkHistoryModel) {
        let dbWorkHistory = this.workHistoryRecords.find(w => w.workHistoryId == workHistory.workHistoryId);
        if (!dbWorkHistory) 
            return <Observable<any>>Observable.throw(new Error("WorkHistory does not exist"));

        if (dbWorkHistory.isValid()) {
            this.saveChanges();
            return Observable.of(dbWorkHistory);
        }
        else {
            return <Observable<any>>Observable.throw(new Error("WorkHistory is not valid"));
        }
    }
    getWorkHistory(params: SearchParams): Observable<WorkHistoryModel[]> {
        if (params.ownerId){ 
            return Observable.create(observer => {
                observer.next(this.workHistoryRecords.filter(e => e.owner.personId == params.ownerId));
                observer.complete();
            });
        }
        else if (params.organizationId){ 
            return Observable.create(observer => {
                observer.next(this.workHistoryRecords.filter(e => e.organization.organizationId == params.organizationId));
                observer.complete();
            });
        }
        return Observable.throw("Invalid search parameters");
    }
    getWorkHistories(): Observable<WorkHistoryModel[]> {
        return Observable.create(observable => {
            observable.next(this.workHistoryRecords);
            observable.complete();
        });
    }
}

export class EducationHistoryRepository extends Repository {
    educationHistoryRecords: EducationHistoryModel[];
    constructor(storageService: StorageService) {
        super(storageService);
        let educationHistoryRecords = <any>storageService.getItem("repository.educationHistoryRecords") || [];
        this.educationHistoryRecords = educationHistoryRecords.map(eh => new EducationHistoryModel(eh));
    }
    saveChanges() {
        this.storageSerice.setItem("repository.educationHistoryRecords", this.educationHistoryRecords);
    }
    createEducationHistory(educationHistory: EducationHistoryModel) {
        if (!educationHistory.isValid()) {
            return <Observable<any>>Observable.throw(new Error("EducationHistory is not valid"));
        }
        this.educationHistoryRecords.push(educationHistory);
        this.saveChanges();
        return Observable.of(educationHistory);
    }
    updateEducationHistory(educationHistory: EducationHistoryModel) {
        let dbEducationHistory = this.educationHistoryRecords.find(p => p.educationHistoryId == educationHistory.educationHistoryId);
        if (!dbEducationHistory) 
            return <Observable<any>>Observable.throw(new Error("EducationHistory does not exist"));

        if (dbEducationHistory.isValid()){
            dbEducationHistory = educationHistory;
            this.saveChanges();
            return Observable.of(dbEducationHistory);
        }
        else {
            return <Observable<any>>Observable.throw(new Error("EducationHistory is not valid"));
        }
    }
    getEducationHistory(params: SearchParams) {
        if (params.ownerId){ 
            return Observable.create(observer => {
                observer.next(this.educationHistoryRecords.filter(e => e.owner.personId == params.ownerId));
                observer.complete();
            });
        }
        else if (params.organizationId) {
            return Observable.create(observer => {
                observer.next(this.educationHistoryRecords.filter(e => e.organization.organizationId == params.organizationId));
                observer.complete();
            });
        }
    }
    getEducationHistories() {
        return Observable.create(obs => {
            obs.next(this.educationHistoryRecords);
            obs.complete();
        });
    }
}