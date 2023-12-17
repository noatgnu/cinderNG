import { Component } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {MatCardModule} from "@angular/material/card";
import {NgIf, NgStyle} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ProjectFile} from "../project-file";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    NgStyle,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  channelTypeColorMap: {[key:string]: string} = {
    'user-send': '#1e90ff',
    'user-result': '#00ff00',
  }

  form: FormGroup = this.fb.group({
    query: [''],
  })

  resultFile: ProjectFile[] = []
  baseURL = environment.baseURL

  constructor(public websocketService: WebsocketService, private fb: FormBuilder) {
    const sendConnection = this.websocketService.connectSend()
    const resultConnection = this.websocketService.connectResult()
    sendConnection.subscribe(data => {
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs.push(data)
      }
    })

    resultConnection.subscribe(data => {
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs.push(data)
        if (data.data) {
          this.resultFile = data.data
          console.log(data.data)
        }
      }

    })

  }

  search() {
    const query = this.form.controls['query'].value
    const message = {
      channelType: 'user-send',
      senderID: this.websocketService.personalID,
      targetID: 'host',
      message: query,
      requestType: 'user-search-query',
      data: {},
    }
    this.websocketService.sendConnection?.next(message)
  }

  downloadFile(f: ProjectFile) {
    const a = document.createElement('a')
    a.href = `${this.baseURL}/api/files/${f.id}/download`
    a.download = f.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

  }
}
