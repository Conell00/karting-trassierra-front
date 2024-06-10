import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursFormComponent } from './tours-form.component';

describe('ToursFormComponent', () => {
  let component: ToursFormComponent;
  let fixture: ComponentFixture<ToursFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToursFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToursFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
