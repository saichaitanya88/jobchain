import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { WorkHistoryModel, OrganizationModel, EducationHistoryModel } from '../../models/index';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organization: OrganizationModel;
  workHistories: WorkHistoryModel[];
  educationHistories: EducationHistoryModel[];

  constructor(private apiService: ApiService, private authService: AuthService) {

  }

  ngOnInit() {
    this.organization = this.authService.organization;
    this.initWorkHistory();
    this.initEducationHistory();
  }

  initWorkHistory(){
    this.apiService.workHistory.getWorkHistory({ organizationId: this.authService.organization.organizationId }).subscribe(workHistories => {
      this.workHistories = workHistories;
    });
  }
  initEducationHistory(){
    this.apiService.educationHistory.getEducationHistory({ organizationId: this.authService.organization.organizationId }).subscribe(educationHistories => {
      this.educationHistories = educationHistories;
    })
  }

  get pendingWorkHistories() {
    return this.workHistories.filter(w => !w.verified);
  }

  get approvedWorkHistories() {
    return this.workHistories.filter(w => w.verified);
  }

  get pendingEducationHistories() {
    return this.educationHistories.filter(w => !w.verified);
  }

  get approvedEducationHistories() {
    return this.educationHistories.filter(w => w.verified);
  }

  onWorkHistoryApproved(history: WorkHistoryModel){
    history.verified = true;
    this.apiService.workHistory.updateWorkHistory(history).subscribe(() => {
      this.initWorkHistory();
    });
  }
  onEducationHistoryApproved(history: EducationHistoryModel){
    history.verified = true;
    this.apiService.educationHistory.updateEducationHistory(history).subscribe(() => {
      this.initEducationHistory();
    });
  }
}
