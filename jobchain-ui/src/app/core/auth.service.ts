import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { Observable, Observer } from 'rxjs';
import { PersonModel, OrganizationModel, CredentialsModel } from '../models/index';

@Injectable()
export class AuthService {

  person: PersonModel;
  organization: OrganizationModel;

  constructor(private apiService: ApiService, private storageService: StorageService) {
    var currentUser = storageService.getItem("currentUser");
    if (currentUser && currentUser.personId)
      this.person = currentUser;
    else if (currentUser && currentUser.organizationId)
      this.organization = currentUser;
  }

  isLoggedIn() {
    return this.person || this.organization;
  }

  isPerson() {
    return !!this.person;
  }
  isOrganization() {
    return !!this.organization;
  }

  login(credentials: CredentialsModel): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.apiService.login(credentials.email, credentials.password).subscribe(result => {
        if (result.personId)
          this.person = result;
        else
          this.organization = result;

        this.storageService.setItem("currentUser", result);
        observer.next(true);
        observer.complete();
      });
    });
  }
  logout(){
    this.person = null;
    this.organization = null;
    this.storageService.setItem("currentUser", null);
  }
}
