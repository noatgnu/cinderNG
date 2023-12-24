import { Component } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {MatCardModule} from "@angular/material/card";
import {NgIf, NgStyle} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ProjectFile, ProjectFileSearchResult} from "../project-file";
import {environment} from "../../environments/environment";
import {MatSelectModule} from "@angular/material/select";
import {DataFrame, IDataFrame, ISeries, Series} from "data-forge";
import {FileViewComponent} from "../file-view/file-view.component";
import {SearchResult} from "../search-result";
import {WebService} from "../web.service";

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

  resultFile: {[key:string]: IDataFrame<number, ProjectFileSearchResult>} = {}
  baseURL = environment.baseURL
  servers: string[] = []
  currentDisplay: IDataFrame<number, ProjectFileSearchResult> = new DataFrame()
  resultMap: {[key: string]: SearchResult} = {}
  firstRow: {[key: string]: ProjectFile} = {}
  constructor(public websocketService: WebsocketService, private fb: FormBuilder, private web: WebService) {
    const sendConnection = this.websocketService.connectSend()
    const resultConnection = this.websocketService.connectResult()
    sendConnection.subscribe(data => {
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs = [data, ...this.websocketService.websocketLogs]
      }
    })

    resultConnection.subscribe(data => {
      console.log(data)
      if (data.targetID === this.websocketService.personalID) {
        this.websocketService.websocketLogs = [data, ...this.websocketService.websocketLogs]
        if (data.data) {
          if (data.requestType === 'file-upload') {
            if (!this.websocketService.uploadedFileMap[data.senderID]) {
              this.websocketService.uploadedFileMap[data.senderID] = {}
            }
            this.websocketService.uploadedFileMap[data.senderID][data.data[0].id] = data.data[1]
          } else if (data.requestType === 'search') {
            this.resultMap[data.senderID] = data.data
            this.servers = Object.keys(this.resultMap)
            console.log(this.servers)
            this.form.controls['server'].setValue("host")
            if (data.senderID === "host") {
              this.web.getSearchResult(data.data["id"], this.websocketService.sessionID).subscribe((result: ProjectFileSearchResult[]) => {
                this.resultFile[data.senderID] = new DataFrame(result)
                this.currentDisplay = this.resultFile[data.senderID]
                for (const i of this.resultFile[data.senderID]) {
                  this.firstRow[i.id] = i.data[0]
                }
              })
            }
          }

        }
      }

    })

    this.form.controls['server'].valueChanges.subscribe(value => {
      if (value) {
        this.currentDisplay = this.resultFile[value]
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

  protected readonly DataFrame = DataFrame;
}
