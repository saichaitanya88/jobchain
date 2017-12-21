import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as faker from "faker";

import { DataService } from '../../data.service';
import { Configuration } from '../../configuration';
import { PersonModel, OrganizationModel, OrganizationTypeModel } from '../../models/index';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DataService, Configuration]
})
export class RegisterComponent implements OnInit {

  person: PersonModel;
  organization: OrganizationModel;
  isCompany: boolean;
  isEducation: boolean;

  constructor(private apiService: ApiService, private router: Router) {
    this.person = new PersonModel({ personId: UUID.UUID() });
    this.organization = new OrganizationModel({ organizationId: UUID.UUID() });
  }

  ngOnInit() {
    this.person.firstName = faker.name.firstName();
    this.person.lastName = faker.name.lastName();
    this.person.description = faker.lorem.paragraph();
    this.person.phone = faker.phone.phoneNumber();

    this.organization.address.address = faker.address.streetAddress();
    this.organization.description = faker.company.bs();
    this.organization.name = faker.company.companyName();
  }

  tabChanged(event: any) {
    this.isCompany = false;
    this.isEducation = false;
  }

  registerOrganization() {
    if (this.isCompany) this.organization.organizationTypes.push(OrganizationTypeModel.Company);
    if (this.isEducation) this.organization.organizationTypes.push(OrganizationTypeModel.Education);
    if (!this.organization.organizationId) this.organization.organizationId = UUID.UUID();
    if (this.organization.isValid()) {
      this.apiService.organization.createOrganization(this.organization).subscribe(organization => {
        this.router.navigate(["login"]);
      }, error => console.error(error));
    }
  }

  registerIndividual() {
    if (!this.person.personId)
      this.person.personId = UUID.UUID();

    if (this.person.isValid()) {
      this.apiService.person.createPerson(this.person).subscribe(person => {
        this.router.navigate(["login"]);
      }, error => console.error(error));
    }
  }
}