import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSearchComponent } from './leadSearch.component';

describe('FileUploadComponent', () => {
  let component: LeadSearchComponent;
  let fixture: ComponentFixture<LeadSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
