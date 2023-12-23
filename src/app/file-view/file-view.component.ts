import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {ProjectFile} from "../project-file";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss'
})
export class FileViewComponent {
  baseURL = environment.baseURL
  private _data: IDataFrame<number, ProjectFile> = new DataFrame()
  file: ProjectFile|undefined = undefined
  pageSize = 10
  @Input() set data(value: IDataFrame<number, ProjectFile>) {
    this._data = value.distinct((value) => value.headline)
    if (this._data.count() > 0) {
      this.file = this._data.first()
      this.displayData = this._data.head(this.pageSize)
    }
  }
  displayData: IDataFrame<number, ProjectFile> = new DataFrame()
  get data(): IDataFrame<number, ProjectFile> {
    return this._data
  }

  @Input() server: string = ""

  @Input() pyreName: string = ""

  constructor(public websocket: WebsocketService) {
  }

  requestFileHandler() {
    const message = {
      'message': "request sent",
      'requestType': "user-file-request",
      'senderID': this.websocket.personalID,
      'targetID': "host",
      'channelType': "file-request",
      'data': this.file,
      'clientID': this.websocket.personalID,
      'sessionID': this.websocket.sessionID,
      'pyreName': this.pyreName,
    }
    this.websocket.websocketLogs = [message, ...this.websocket.websocketLogs]
    this.websocket.sendConnection?.next(message)
  }

  downloadFileHandler() {
    if (this.file) {
      const a = document.createElement('a')
      a.href = `${this.baseURL}/api/files/${this.file.id}/session/${this.websocket.sessionID}/download`
      a.download = this.file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

  }
  handlePageEvent(e: PageEvent) {
    const pageIndex = e.pageIndex
    const pageSize = e.pageSize
    console.log(pageIndex, pageSize)
    if (pageIndex * pageSize >= this._data.count()) {
      this.displayData = this._data.skip(pageIndex * pageSize).bake()
    } else {
      this.displayData = this._data.skip(pageIndex * pageSize).take(pageSize).bake()
    }
    console.log(this.displayData.toArray())
  }
}
