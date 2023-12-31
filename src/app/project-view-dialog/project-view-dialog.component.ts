import {Component, Input} from '@angular/core';
import {ProjectFileSearchResult, ProjectSearchResult} from "../project-file";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DataFrame, IDataFrame} from "data-forge";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-project-view-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatButtonModule,
    MatDialogActions,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './project-view-dialog.component.html',
  styleUrl: './project-view-dialog.component.scss'
})
export class ProjectViewDialogComponent {
  @Input() data: ProjectSearchResult|undefined = undefined
  @Input() files: IDataFrame<number, ProjectFileSearchResult> = new DataFrame()

  constructor() {
  }

}
