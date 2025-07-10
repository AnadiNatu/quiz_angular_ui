import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreatedQuizComponent } from './view-created-quiz.component';

describe('ViewCreatedQuizComponent', () => {
  let component: ViewCreatedQuizComponent;
  let fixture: ComponentFixture<ViewCreatedQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreatedQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCreatedQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
