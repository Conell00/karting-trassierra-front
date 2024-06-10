import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitFormComponent } from './circuit-form.component';

describe('CircuitFormComponent', () => {
  let component: CircuitFormComponent;
  let fixture: ComponentFixture<CircuitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircuitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
