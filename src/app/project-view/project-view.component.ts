import {Component, Input} from '@angular/core';
import {ProjectFileSearchResult, ProjectSearchResult} from "../project-file";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule
  ],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.scss'
})
export class ProjectViewComponent {
  @Input() data: ProjectSearchResult|undefined = undefined
  @Input() files: ProjectFileSearchResult[] = []
}
