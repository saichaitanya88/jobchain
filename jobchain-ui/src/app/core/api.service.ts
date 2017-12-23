import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { RepositoryService, PersonRepository, OrganizationRepository, WorkHistoryRepository, EducationHistoryRepository } from './repository/repository.service';
import { PersonModel, OrganizationModel, WorkHistoryModel, EducationHistoryModel, OrganizationTypeModel } from '../models/index';
import { StorageService } from './storage.service';
import { Configuration } from '../configuration';

const configuration = new Configuration();

@Injectable()
export class ApiService implements RepositoryService {
  person: ApiPersonRepository;
  organization: ApiOrganizationRepository;
  workHistory: ApiWorkHistoryRepository;
  educationHistory: ApiEducationHistoryRepository;
  constructor() {
    this.person = new ApiPersonRepository();
    this.organization = new ApiOrganizationRepository();
    this.educationHistory = new ApiEducationHistoryRepository();
    this.workHistory = new ApiWorkHistoryRepository();
  }
  login(email: string, password: string): Observable<any> {
    let request = {
      method: 'post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password })
    };

    return Observable.create((observer: Observer<any>) => {
      fetch(configuration.ServerWithApiUrl + "/authenticate", request)
        .then(res => res.json())
        .then(o => {
          let obj: any = o.personId ? new PersonModel(o) : new OrganizationModel(o);
          observer.next(obj);
          observer.complete();
        }).catch(observer.error);
    });
  }
  getCompanies(): Observable<OrganizationModel[]> {
    let request = {
      method: 'get',
      headers: { "Content-type": "application/json" }
    };
    return Observable.create((observer: Observer<any>) => {
      fetch(configuration.ServerWithApiUrl + "/organizations/company", request)
        .then(res => res.json())
        .then(organizations => {
          let orgs = (<OrganizationModel[]>organizations.map(o => new OrganizationModel(o)));
          observer.next(orgs);
          observer.complete();
        }).catch(observer.error);
    });
  }
  getInstitutions(): Observable<OrganizationModel[]> {
    let request = {
      method: 'get',
      headers: { "Content-type": "application/json" }
    };
    return Observable.create((observer: Observer<any>) => {
      fetch(configuration.ServerWithApiUrl + "/organizations/education", request)
        .then(res => res.json())
        .then(organizations => {
          let orgs = (<OrganizationModel[]>organizations.map(o => new OrganizationModel(o)));
          observer.next(orgs);
          observer.complete();
        }).catch(observer.error);
    });
  }
}

export class ApiPersonRepository implements PersonRepository {
  persons: PersonModel[];
  createPerson(person: PersonModel): Observable<any> {
    let request = {
      method: 'post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(person)
    };

    return Observable.create((observer: Observer<PersonModel>) => {
      fetch(configuration.ServerWithApiUrl + "/person", request)
        .then(res => new PersonModel(res.json()))
        .then(person => {
          observer.next(person);
          observer.complete();
        }).catch(observer.error);
    });
  }
  updatePerson(person: PersonModel): Observable<any> {
    throw new Error("Method not implemented.");
  }
  getPerson(personId: string): Observable<PersonModel> {
    throw new Error("Method not implemented.");
  }
  getPersons() {
    throw new Error("Method not implemented.");
  }
  saveChanges() { }
}
export class ApiOrganizationRepository implements OrganizationRepository {
  organizations: OrganizationModel[];
  saveChanges() { }
  createOrganization(organization: OrganizationModel): Observable<any> {
    let request = {
      method: 'post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(organization)
    };

    return Observable.create((observer: Observer<PersonModel>) => {
      fetch(configuration.ServerWithApiUrl + "/organization", request)
        .then(res => new PersonModel(res.json()))
        .then(org => {
          observer.next(org);
          observer.complete();
        }).catch(observer.error);
    });
  }
  updateOrganization(organization: OrganizationModel): Observable<any> {
    throw new Error("Method not implemented.");
  }
  getOrganization(organizationId: string): Observable<OrganizationModel> {
    throw new Error("Method not implemented.");
  }
  getOrganizations(): Observable<OrganizationModel[]> {
    let request = {
      method: 'get',
      headers: { "Content-type": "application/json" }
    };

    return Observable.create((observer: Observer<OrganizationModel[]>) => {
      fetch(configuration.ServerWithApiUrl + "/organizations", request)
        .then(res => res.json())
        .then((records: any[]) => records.map(record => new OrganizationModel(record)))
        .then(orgs => {
          observer.next(orgs);
          observer.complete();
        }).catch(observer.error);
    });
  }
}
export class ApiWorkHistoryRepository implements WorkHistoryRepository {
  workHistoryRecords: WorkHistoryModel[];
  saveChanges() { }
  createWorkHistory(workHistory: WorkHistoryModel): Observable<WorkHistoryModel> {
    let request = {
      method: 'post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(workHistory)
    };

    return Observable.create((observer: Observer<WorkHistoryModel>) => {
      fetch(configuration.ServerWithApiUrl + "/work-history", request)
        .then(res => new WorkHistoryModel(res.json()))
        .then(history => {
          observer.next(history);
          observer.complete();
        }).catch(observer.error);
    });
  }
  updateWorkHistory(workHistory: WorkHistoryModel): Observable<WorkHistoryModel> {
    let request = {
      method: 'put',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(workHistory)
    };

    return Observable.create((observer: Observer<WorkHistoryModel>) => {
      fetch(configuration.ServerWithApiUrl + "/work-history" + `/${workHistory.workHistoryId}`, request)
        .then(res => new WorkHistoryModel(res.json()))
        .then(history => {
          observer.next(history);
          observer.complete();
        }).catch(observer.error);
    });
  }
  getWorkHistory(params: { [key: string]: any; }): Observable<WorkHistoryModel[]> {
    let request = { method: 'get', headers: { "Content-type": "application/json" } };
    if (params.ownerId) {
      return Observable.create(observer => {
        fetch(`${configuration.ServerWithApiUrl}/work-history/person/${params.ownerId}`, request)
          .then(res => res.json())
          .then((records: any[]) => records.map(record => new WorkHistoryModel(record)))
          .then(workHistory => {
            observer.next(workHistory);
            observer.complete();
          })
          .catch(observer.error);
      });
    }
    else if (params.organizationId) {
      return Observable.create(observer => {
        fetch(`${configuration.ServerWithApiUrl}/work-history/organization/${params.organizationId}`, request)
          .then(res => res.json())
          .then((records: any[]) => records.map(record => new WorkHistoryModel(record)))
          .then(workHistory => {
            observer.next(workHistory);
            observer.complete();
          })
          .catch(observer.error);
      });
    }
    return Observable.throw("Invalid search parameters");
  }
  getWorkHistories(): Observable<WorkHistoryModel[]> {
    throw new Error("Method not implemented.");
  }
}
export class ApiEducationHistoryRepository implements EducationHistoryRepository {
  educationHistoryRecords: EducationHistoryModel[];
  saveChanges() { }
  createEducationHistory(educationHistory: EducationHistoryModel): Observable<EducationHistoryModel> {
    let request = {
      method: 'post',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(educationHistory)
    };

    return Observable.create((observer: Observer<EducationHistoryModel>) => {
      fetch(configuration.ServerWithApiUrl + "/education-history", request)
        .then(res => new EducationHistoryModel(res.json()))
        .then(history => {
          observer.next(history);
          observer.complete();
        }).catch(observer.error);
    });
  }
  updateEducationHistory(educationHistory: EducationHistoryModel): Observable<EducationHistoryModel> {
    let request = {
      method: 'put',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(educationHistory)
    };

    return Observable.create((observer: Observer<EducationHistoryModel>) => {
      fetch(configuration.ServerWithApiUrl + "/education-history" + `/${educationHistory.educationHistoryId}`, request)
        .then(res => new EducationHistoryModel(res.json()))
        .then(history => {
          observer.next(history);
          observer.complete();
        }).catch(observer.error);
    });
  }
  getEducationHistory(params: { [key: string]: any; }): Observable<EducationHistoryModel[]> {
    let request = { method: 'get', headers: { "Content-type": "application/json" } };
    if (params.ownerId) {
      return Observable.create(observer => {
        fetch(`${configuration.ServerWithApiUrl}/education-history/person/${params.ownerId}`, request)
          .then(res => res.json())
          .then((records: any[]) => records.map(record => new EducationHistoryModel(record)))
          .then(history => {
            observer.next(history);
            observer.complete();
          })
          .catch(observer.error);
      });
    }
    else if (params.organizationId) {
      return Observable.create(observer => {
        fetch(`${configuration.ServerWithApiUrl}/education-history/organization/${params.organizationId}`, request)
          .then(res => res.json())
          .then((records: any[]) => records.map(record => new EducationHistoryModel(record)))
          .then(history => {
            observer.next(history);
            observer.complete();
          })
          .catch(observer.error);
      });
    }
    return Observable.throw("Invalid search parameters");
  }
  getEducationHistories(): Observable<EducationHistoryModel[]> {
    throw new Error("Method not implemented.");
  }
}