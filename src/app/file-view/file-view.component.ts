import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DataFrame, IDataFrame} from "data-forge";
import {Analysis, ProjectFile} from "../project-file";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {SampleDataDialogComponent} from "../sample-data-dialog/sample-data-dialog.component";

@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss'
})
export class FileViewComponent {
  baseURL = environment.baseURL
  private _data: IDataFrame<number, ProjectFile> = new DataFrame()
  file: ProjectFile|undefined = undefined
  pageSize = 10
  @Input() set data(value: any) {
    this._data = new DataFrame(value)
    if (this._data.count() > 0) {
      this.file = this._data.first()
      this.displayData = this._data.head(this.pageSize)
    }
  }
  displayData: IDataFrame<number, ProjectFile> = new DataFrame()
  get data(): IDataFrame<number, ProjectFile> {
    return this._data
  }

  selectedAnalysis: string = "No analysis selected"

  @Input() server: string = ""

  @Input() pyreName: string = ""

  @Input() found_lines: number[] = []

  @Input() found_terms: string[] = []

  @Input() analysis: {[key: string]: Analysis} = {}

  @Input() found_line_term_map: {[key: string]: string[]} = {}

  fcCutOff: number = 1.5
  pCutoff: number = 0.05

  fcDataMap: {[key: string]: {value: number, passed: boolean}} = {}
  pValueDataMap: {[key: string]: {value: number, passed: boolean}} = {}

  constructor(public websocket: WebsocketService, private dialog: MatDialog) {
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

  getKeys(object: any): string[] {
    return Object.keys(object)
  }

  getFloat(value: string, row: string, valueType: string): {value: number, passed: boolean} {
    const data = parseFloat(value)
    let passed = false
    if (!isNaN(data)) {
      if (valueType === "FC") {
        passed = this.passFCCutOff(data)
      } else {
        passed = this.passSignificance(data)
      }
    }
    const res = {value: data, passed: passed}
    if (valueType === "FC") {
      this.fcDataMap[row] = res
    } else {
      this.pValueDataMap[row] = res
    }
    return res
  }

  passFCCutOff(value: number): boolean {
    return Math.abs(value) >= this.fcCutOff
  }

  passSignificance(value: number): boolean {
    return value <= -Math.log10(this.pCutoff)
  }

  viewBarChart(row: string, conditionA: string, conditionB: string) {
    const ref = this.dialog.open(SampleDataDialogComponent, {minWidth: 800, minHeight: 600})
    ref.componentInstance.data = this.analysis[this.selectedAnalysis].searched_file[row]
    const limited_annotation: any = {}
    for (const key of Object.keys(this.analysis[this.selectedAnalysis].sample_annotation)) {
      if (this.analysis[this.selectedAnalysis].sample_annotation[key] === conditionA || this.analysis[this.selectedAnalysis].sample_annotation[key] === conditionB) {
        limited_annotation[key] = this.analysis[this.selectedAnalysis].sample_annotation[key]
      }
    }
    ref.componentInstance.annotations = limited_annotation
    ref.componentInstance.conditions = [conditionA, conditionB]
    ref.componentInstance.drawBarChart()
  }
}
