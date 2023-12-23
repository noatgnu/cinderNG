import { Component } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {MatCardModule} from "@angular/material/card";
import {NgIf, NgStyle} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ProjectFile} from "../project-file";
import {environment} from "../../environments/environment";
import {MatSelectModule} from "@angular/material/select";
import {DataFrame, IDataFrame, ISeries, Series} from "data-forge";
import {FileViewComponent} from "../file-view/file-view.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    NgStyle,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf,
    MatSelectModule,
    FileViewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  channelTypeColorMap: {[key:string]: string} = {
    'user-send': '#1e90ff',
    'user-result': '#00ff00',
  }

  form: FormGroup = this.fb.group({
    query: [''],
    description: [''],
    server: [''],
    pyreName: ['public'],
  })

  resultFile: {[key:string]: IDataFrame<number, ProjectFile>} = {}
  baseURL = environment.baseURL
  servers: string[] = []
  currentDisplay:ISeries<number, IDataFrame<number, ProjectFile>> = new Series()

  uploadedFileMap: {[key:string]: {[key: string]: ProjectFile}} = {}
  constructor(public websocketService: WebsocketService, private fb: FormBuilder) {
    const sendConnection = this.websocketService.connectSend()
    const resultConnection = this.websocketService.connectResult()
    sendConnection.subscribe(data => {
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs = [data, ...this.websocketService.websocketLogs]
      }
    })

    resultConnection.subscribe(data => {
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs = [data, ...this.websocketService.websocketLogs]
        if (data.data) {
          if (data.requestType === 'file-upload') {
            if (!this.websocketService.uploadedFileMap[data.senderID]) {
              this.websocketService.uploadedFileMap[data.senderID] = {}
            }
            this.websocketService.uploadedFileMap[data.senderID][data.data[0].id] = data.data[1]
          } else {
            this.resultFile[data.senderID] = new DataFrame(data.data)
            this.servers = Object.keys(this.resultFile)
          }

        }
      }

    })

    this.form.controls['server'].valueChanges.subscribe(value => {
      if (value) {
        this.currentDisplay = this.resultFile[value].groupBy((f: ProjectFile) => f.id)
      }
    })

  }

  search() {
    const query = this.form.controls['query'].value
    const message = {
      channelType: 'user-send',
      senderID: this.websocketService.personalID,
      targetID: 'host',
      message: 'request sent',
      requestType: 'user-search-query',
      sessionID: this.websocketService.sessionID,
      clientID: this.websocketService.personalID,
      pyreName: this.form.value['pyreName'],
      data: {
        term: query,
        description: this.form.controls['description'].value,
      },
    }
    this.websocketService.websocketLogs = [message, ...this.websocketService.websocketLogs]
    this.websocketService.sendConnection?.next(message)
  }
}
