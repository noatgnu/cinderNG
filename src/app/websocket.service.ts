import { Injectable } from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {environment} from "../environments/environment";
import {WebsocketMessage} from "./websocket-message";
import {ProjectFile} from "./project-file";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  sessionID: string = ""
  personalID: string = crypto.randomUUID().replace(/\s/g, "")
  sendConnection: WebSocketSubject<WebsocketMessage>|undefined
  resultConnection: WebSocketSubject<WebsocketMessage>|undefined
  baseURL: string = environment.baseURL
  websocketLogs: WebsocketMessage[] = []
  uploadedFileMap: {[key:string]: {[key: string]: ProjectFile}} = {}
  constructor() { }

  connectSend() {
    let connecting = true
    console.log(this.sessionID)
    const url = `${this.baseURL}/ws/user/send/${this.sessionID}/${this.personalID}/`.replace("http", "ws")


    if (!this.sendConnection) {
      this.sendConnection = new WebSocketSubject(url)
    }
    connecting = false
    return this.sendConnection
  }

  connectResult() {
    let connecting = true
    const url = `${this.baseURL}/ws/user/results/${this.sessionID}/${this.personalID}/`.replace("http", "ws")


    if (!this.resultConnection) {
      this.resultConnection = new WebSocketSubject(url)
    }
    connecting = false
    return this.resultConnection
  }



}
