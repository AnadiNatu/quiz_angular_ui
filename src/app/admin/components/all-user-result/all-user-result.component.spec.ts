import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserResultComponent } from './all-user-result.component';

describe('AllUserResultComponent', () => {
  let component: AllUserResultComponent;
  let fixture: ComponentFixture<AllUserResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUserResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
