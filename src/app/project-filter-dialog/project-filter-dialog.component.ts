import {Component, Input} from '@angular/core';
import {MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatListModule} from "@angular/material/list";
import {ProjectFileSearchResult, ProjectSearchResult} from "../project-file";

@Component({
  selector: 'app-project-filter-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatListModule
  ],
  templateUrl: './project-filter-dialog.component.html',
  styleUrl: './project-filter-dialog.component.scss'
})
export class ProjectFilterDialogComponent {
  @Input() data: ProjectSearchResult[] = []


}
