import { Component } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-progress-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ],
  templateUrl: './progress-dialog.component.html',
  styleUrl: './progress-dialog.component.scss'
})
export class ProgressDialogComponent {
  constructor(public websocketService: WebsocketService) {

  }

}
