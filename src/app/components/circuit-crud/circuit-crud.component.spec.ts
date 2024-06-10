import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitCrudComponent } from './circuit-crud.component';

describe('CircuitCrudComponent', () => {
  let component: CircuitCrudComponent;
  let fixture: ComponentFixture<CircuitCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircuitCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
