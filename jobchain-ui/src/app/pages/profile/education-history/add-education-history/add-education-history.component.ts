import { Component, OnInit, Input, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MdlDialogComponent } from '@angular-mdl/core';
import * as faker from "faker";

import { EducationHistoryModel, OrganizationModel, PersonModel } from '../../../../models/index';
import { ApiService } from '../../../../core/api.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'profile-add-education-history',
  templateUrl: './add-education-history.component.html',
  styleUrls: ['./add-education-history.component.scss']
})
export class AddEducationHistoryComponent implements OnInit {
  @Input() open: boolean;  
  @Input() person: PersonModel;
  
  @ViewChild(MdlDialogComponent) dialog: MdlDialogComponent;
  @Output() addEducationHistory = new EventEmitter<EducationHistoryModel>();

  educationHistory = new EducationHistoryModel();
  organizations: OrganizationModel[];
  saving: boolean;

  constructor(private apiService: ApiService) { 
    this.apiService.getInstitutions().subscribe(orgs => this.organizations = orgs);
  }

  ngOnInit() {
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges["open"] && simpleChanges["open"].currentValue && !simpleChanges["open"].previousValue) {
      this.openDialog();
    }
  }

  openDialog() {
    this.educationHistory = this.getNewEducationHistory();
    this.educationHistory.owner = this.person;
    if (this.dialog) this.dialog.show();
  }
  getNewEducationHistory(){
    let eh = new EducationHistoryModel({ educationHistoryId: UUID.UUID() });
    let format = "YYYY-MM-DD";
    eh.description = faker.random.words(15);
    eh.title = faker.name.title();
    let date = faker.date.past(20);
    eh.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let endDate = faker.date.between(date, new Date())
    eh.endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return eh;
  }

  onDialogShow() {
    // treat as ngOnInit for dialog
  }

  onDialogHide() {
    if (this.dialog) this.dialog.close();
  }

  orgChanged(e: Event) {
    console.log(e);
    this.educationHistory.organization = this.organizations.find(o => o.organizationId == (<any>e.target).value);
  }

  save() {
    console.log("isValid", this.educationHistory.isValid());
    if(this.educationHistory.isValid()){
      this.saving = true;
      this.apiService.educationHistory.createEducationHistory(this.educationHistory).subscribe(result => {
        this.close();
        this.saving = false;
        this.addEducationHistory.emit();
      });
    }
  }

  close() {
    this.onDialogHide();
  }
}
