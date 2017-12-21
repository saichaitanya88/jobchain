import { Component, OnInit } from '@angular/core';
import * as moment from "moment";
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { PersonModel, EducationHistoryModel, WorkHistoryModel } from '../../models/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  person: PersonModel;
  workHistories: WorkHistoryModel[];
  educationHistories: EducationHistoryModel[];
  dialogs: { [key: string]: boolean } = {};

  constructor(private apiService: ApiService, private authService: AuthService) {
    this.dialogs["work-history"] = false;
    this.dialogs["education-history"] = false;
  }

  ngOnInit() {
    this.person = this.authService.person;
    this.getLatestWorkHistory();
    this.getLatestEducationHistory();
  }

  openWorkHistoryModal() {
    this.dialogs["work-history"] = false;
    setTimeout(() => this.dialogs["work-history"] = true);
  }
  closeWorkHistoryModal() {
    this.dialogs["work-history"] = false;
  }
  openEducationHistoryModal() {
    this.dialogs["education-history"] = false;
    setTimeout(() => this.dialogs["education-history"] = true);
  }
  closeEducationHistoryModal() {
    this.dialogs["education-history"] = false;
  }

  getLatestWorkHistory() {
    this.apiService.workHistory.getWorkHistory({ ownerId: this.person.personId }).subscribe(results => {
      this.workHistories = results.sort((a, b) => moment(b.startDate).toDate().getTime() - (moment(a.startDate).toDate().getTime()));
    });
  }
  getLatestEducationHistory(){
    this.apiService.educationHistory.getEducationHistory({ ownerId: this.person.personId }).subscribe(results => {
      this.educationHistories = results.sort((a, b) => moment(b.startDate).toDate().getTime() - (moment(a.startDate).toDate().getTime()));
    });
  }

  onWorkHistoryAdded() {
    this.getLatestWorkHistory();
  }
  onEducationHistoryAdded() {
    this.getLatestEducationHistory();
  }

}
