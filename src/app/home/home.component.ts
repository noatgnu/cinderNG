import { Component } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {MatCardModule} from "@angular/material/card";
import {NgIf, NgStyle} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ProjectFile, ProjectFileSearchResult, ProjectSearchResult} from "../project-file";
import {environment} from "../../environments/environment";
import {MatSelectModule} from "@angular/material/select";
import {DataFrame, IDataFrame, ISeries, Series} from "data-forge";
import {FileViewComponent} from "../file-view/file-view.component";
import {SearchResult} from "../search-result";
import {WebService} from "../web.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialog} from "@angular/material/dialog";
import {ProjectFilterDialogComponent} from "../project-filter-dialog/project-filter-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    FileViewComponent,
    MatProgressSpinnerModule
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
  selectedProjects: ProjectSearchResult[] = []
  resultFile: {[key:string]: IDataFrame<number, ProjectFileSearchResult>} = {}
  baseURL = environment.baseURL
  servers: string[] = ["None selected"]
  currentDisplay: IDataFrame<number, ProjectFileSearchResult> = new DataFrame()
  resultMap: {[key: string]: SearchResult} = {}
  firstRow: {[key: string]: ProjectFile} = {}
  searchingServers: string[] = []
  searchCompleted: {[key: string]: boolean} = {}
  searching: boolean = false
  resultProject: {[key: string]: ProjectSearchResult[]} = {}
  constructor(public websocketService: WebsocketService, private fb: FormBuilder, private web: WebService, private dialog: MatDialog, private snackBar: MatSnackBar) {
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
        if (data.message === "Results found" || data.message === "No results found") {
          this.searchCompleted[data.senderID] = true

          if (data.message === "Results found") {
            this.resultMap[data.senderID] = data.data
            this.servers = ["None selected", ...Object.keys(this.resultMap)]
          }
          if (Object.values(this.searchCompleted).every((v) => v === true)) {
            this.searching = false
          }
        }
        if (data.requestType === 'file-upload') {
          if (!this.websocketService.uploadedFileMap[data.senderID]) {
            this.websocketService.uploadedFileMap[data.senderID] = {}
          }
          this.websocketService.uploadedFileMap[data.senderID][data.data[0].id] = data.data[1]
        } else if (data.requestType === 'search') {


        } else if (data.requestType === 'search-started') {
          if (!this.searchingServers.includes(data.senderID)) {
            this.searchingServers.push(data.senderID)
          }
          this.searchCompleted[data.senderID] = false
        } else if (data.requestType === 'file-upload-not-allow') {
          this.snackBar.open("File request is not allowed for this node. Please contact "+data.data, "Close")
        }
      }

    })

    this.form.controls['server'].valueChanges.subscribe(value => {
      if (value) {
        console.log(value)

        if (this.resultMap[value]) {
          this.web.getSearchResult(this.resultMap[value]["id"], this.websocketService.sessionID).subscribe((result) => {
            this.resultFile[value] = new DataFrame(result.files)
            this.resultProject[value] = result.projects
            this.currentDisplay = this.resultFile[value]
            this.selectedProjects = []
            this.firstRow = {}
            for (const i of this.resultFile[value]) {
              this.firstRow[i.id] = i.data[0]
            }
          })
        }
      }
    })

  }

  search() {
    this.searching = true
    this.servers = ["None selected"]
    this.resultMap = {}
    this.searchingServers = []
    this.currentDisplay = new DataFrame()
    this.firstRow = {}
    this.selectedProjects = []
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

  viewProjectFilterDialog() {
    if (this.resultProject[this.form.value['server']]) {
      const dialogRef = this.dialog.open(ProjectFilterDialogComponent)
      dialogRef.componentInstance.data = this.resultProject[this.form.value['server']]
      dialogRef.componentInstance.selected = this.selectedProjects.map((data: ProjectSearchResult) => {
        return data.id
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result.length > 0 && this.resultFile[this.form.value['server']]) {
          this.selectedProjects = result.map((data: number) => {
            return this.resultProject[this.form.value['server']].find((row: ProjectSearchResult) => {
              return row.id === data
            })
          })
          this.currentDisplay = this.resultFile[this.form.value['server']].where((row: ProjectFileSearchResult) => {
            return result.includes(this.firstRow[row.id].project_id)
          })
        }
      })
    }
  }

  resetFilter() {
    if (this.resultFile[this.form.value['server']]) {
      this.selectedProjects = []
      this.currentDisplay = this.resultFile[this.form.value['server']]
    } else {
      this.selectedProjects = []
      this.currentDisplay = new DataFrame()
    }
  }
}
