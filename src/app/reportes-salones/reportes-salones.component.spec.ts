import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesSalonesComponent } from './reportes-salones.component';

describe('ReportesSalonesComponent', () => {
  let component: ReportesSalonesComponent;
  let fixture: ComponentFixture<ReportesSalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesSalonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
