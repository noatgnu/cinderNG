import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from "@angular/material/toolbar";
import {WebService} from "./web.service";
import {WebsocketService} from "./websocket.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinderNG';
  constructor(private webService: WebService, public websoketService: WebsocketService) {
    this.webService.getSessionID().subscribe((data: string) => {
      this.websoketService.sessionID = data
    })
  }



}
