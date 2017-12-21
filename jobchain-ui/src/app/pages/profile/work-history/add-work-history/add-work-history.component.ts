import { Component, OnInit, Input, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MdlDialogComponent } from "@angular-mdl/core"
import * as faker from "faker";
import * as moment from "moment";

import { WorkHistoryModel, OrganizationModel, PersonModel } from '../../../../models';
import { ApiService } from '../../../../core/api.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'profile-add-work-history',
  templateUrl: './add-work-history.component.html',
  styleUrls: ['./add-work-history.component.scss']
})
export class AddWorkHistoryComponent implements OnInit {

  @Input() open: boolean;
  @Input() person: PersonModel;
  @ViewChild(MdlDialogComponent) dialog: MdlDialogComponent;
  @Output() addWorkHistory = new EventEmitter<WorkHistoryModel>();

  saving: boolean;
  workHistory = new WorkHistoryModel();
  organizations: OrganizationModel[] = [];

  constructor(private apiService: ApiService) { 
    this.apiService.getCompanies().subscribe(orgs => this.organizations = orgs);
  }

  ngOnInit() {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges["open"] && simpleChanges["open"].currentValue && !simpleChanges["open"].previousValue) {
      this.openDialog();
    }
  }

  openDialog() {
    this.workHistory = this.getNewWorkHistory();
    this.workHistory.owner = this.person;
    this.saving = false;
    if (this.dialog) this.dialog.show();
  }

  getNewWorkHistory(){
    let wh = new WorkHistoryModel({ workHistoryId: UUID.UUID() });
    let format = "YYYY-MM-DD";
    wh.description = faker.random.words(15);
    wh.title = faker.name.title();
    let date = faker.date.past(20);
    wh.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let endDate = faker.date.between(date, new Date())
    wh.endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return wh;
  }

  onDialogShow() {
    // treat as ngOnInit for dialog
  }

  onDialogHide() {
    if (this.dialog) this.dialog.close();
  }

  orgChanged(e: Event){
    console.log(e);
    this.workHistory.organization = this.organizations.find(o => o.organizationId == (<any>e.target).value);
  }

  save() {
    if(this.workHistory.isValid()){
      this.saving = true;
      this.apiService.workHistory.createWorkHistory(this.workHistory).subscribe(result => {
        this.close();
        this.saving = false;
        this.addWorkHistory.emit();
      })
    }
  }

  close() {
    this.onDialogHide();
  }
}
