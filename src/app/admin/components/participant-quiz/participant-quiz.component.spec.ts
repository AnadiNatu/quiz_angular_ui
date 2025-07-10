import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantQuizComponent } from './participant-quiz.component';

describe('ParticipantQuizComponent', () => {
  let component: ParticipantQuizComponent;
  let fixture: ComponentFixture<ParticipantQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
