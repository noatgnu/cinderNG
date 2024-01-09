import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {WebsocketService} from "../websocket.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-connection-logs-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose
  ],
  templateUrl: './connection-logs-dialog.component.html',
  styleUrl: './connection-logs-dialog.component.scss'
})
export class ConnectionLogsDialogComponent {
  channelTypeColorMap: {[key:string]: string} = {
    'user-send': '#1e90ff',
    'user-result': '#00ff00',
  }
  constructor(public websocketService: WebsocketService) {
  }

}
