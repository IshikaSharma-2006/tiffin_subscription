import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PauseResume } from './pause-resume';

describe('PauseResume', () => {
  let component: PauseResume;
  let fixture: ComponentFixture<PauseResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PauseResume],
    }).compileComponents();

    fixture = TestBed.createComponent(PauseResume);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
