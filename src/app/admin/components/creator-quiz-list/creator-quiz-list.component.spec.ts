import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorQuizListComponent } from './creator-quiz-list.component';

describe('CreatorQuizListComponent', () => {
  let component: CreatorQuizListComponent;
  let fixture: ComponentFixture<CreatorQuizListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorQuizListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatorQuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
