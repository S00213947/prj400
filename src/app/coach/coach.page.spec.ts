import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachPage } from './coach.page';

describe('CoachPage', () => {
  let component: CoachPage;
  let fixture: ComponentFixture<CoachPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
