import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorQuizDetailsComponent } from './creator-quiz-details.component';

describe('CreatorQuizDetailsComponent', () => {
  let component: CreatorQuizDetailsComponent;
  let fixture: ComponentFixture<CreatorQuizDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorQuizDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorQuizDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
