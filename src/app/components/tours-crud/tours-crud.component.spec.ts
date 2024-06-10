import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursCrudComponent } from './tours-crud.component';

describe('ToursCrudComponent', () => {
  let component: ToursCrudComponent;
  let fixture: ComponentFixture<ToursCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToursCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToursCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
