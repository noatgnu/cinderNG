import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionLogsDialogComponent } from './connection-logs-dialog.component';

describe('ConnectionLogsDialogComponent', () => {
  let component: ConnectionLogsDialogComponent;
  let fixture: ComponentFixture<ConnectionLogsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionLogsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
