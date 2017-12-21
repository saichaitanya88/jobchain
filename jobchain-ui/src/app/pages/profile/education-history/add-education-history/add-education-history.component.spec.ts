import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationHistoryComponent } from './add-education-history.component';

describe('AddEducationHistoryComponent', () => {
  let component: AddEducationHistoryComponent;
  let fixture: ComponentFixture<AddEducationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEducationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEducationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
