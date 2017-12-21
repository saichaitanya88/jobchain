import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from '../shared.module';
import { HttpModule } from '@angular/http';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { WorkHistoryComponent } from './profile/work-history/work-history.component';
import { EducationHistoryComponent } from './profile/education-history/education-history.component';
import { AddWorkHistoryComponent } from './profile/work-history/add-work-history/add-work-history.component';
import { AddEducationHistoryComponent } from './profile/education-history/add-education-history/add-education-history.component';
import { OrganizationComponent } from './organization/organization.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, HttpModule, RouterModule
  ],
  declarations: [LoginComponent, RegisterComponent, PageNotFoundComponent, ProfileComponent, WorkHistoryComponent, EducationHistoryComponent, AddWorkHistoryComponent, AddEducationHistoryComponent, OrganizationComponent],
  providers: [ ]
})
export class PagesModule { }
