import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewDialogComponent } from './project-view-dialog.component';

describe('ProjectViewDialogComponent', () => {
  let component: ProjectViewDialogComponent;
  let fixture: ComponentFixture<ProjectViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectViewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
