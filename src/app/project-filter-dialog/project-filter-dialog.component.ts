import {Component, Input} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {ProjectFileSearchResult, ProjectSearchResult} from "../project-file";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-project-filter-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatListModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ],
  templateUrl: './project-filter-dialog.component.html',
  styleUrl: './project-filter-dialog.component.scss'
})
export class ProjectFilterDialogComponent {
  @Input() data: ProjectSearchResult[] = []

  form: FormGroup = this.fb.group({
    selected: new FormControl<number[]>([])
  })

  constructor(private fb: FormBuilder) {
  }


}
