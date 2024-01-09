import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from "@angular/material/toolbar";
import {WebService} from "./web.service";
import {WebsocketService} from "./websocket.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ConnectionLogsDialogComponent} from "./connection-logs-dialog/connection-logs-dialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinderNG';
  constructor(private webService: WebService, public websoketService: WebsocketService, private dialog: MatDialog) {
    this.webService.getSessionID().subscribe((data: string) => {
      this.websoketService.sessionID = data
    })
  }

  openLogDialog() {
    const ref = this.dialog.open(ConnectionLogsDialogComponent)
  }

}
