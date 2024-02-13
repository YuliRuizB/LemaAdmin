import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesAdministracionComponent } from './reportes-administracion.component';

describe('ReportesAdministracionComponent', () => {
  let component: ReportesAdministracionComponent;
  let fixture: ComponentFixture<ReportesAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesAdministracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
