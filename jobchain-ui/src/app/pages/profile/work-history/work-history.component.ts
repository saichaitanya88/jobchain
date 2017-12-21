import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WorkHistoryModel } from '../../../models/index';

@Component({
  selector: 'profile-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit {
  @Input() history: WorkHistoryModel;
  @Input() isOrganization: boolean = false;
  @Output() approved = new EventEmitter<WorkHistoryModel>();
  showApproveButton: boolean;
  constructor() { }

  ngOnInit() {
    this.showApproveButton = this.isOrganization && !this.history.verified;
  }

  parseDate(date: Date){
    return new Date(date).toISOString().substring(0, 10);
  }
  approveHistory(){
    this.approved.emit(this.history);
  }

}
