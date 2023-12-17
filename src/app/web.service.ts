import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WebService {
  baseURL: string = environment.baseURL

  constructor(private http: HttpClient) {

  }

  getSessionID() {
    return this.http.get<string>(`${this.baseURL}/api/websockets/session_id`, {responseType: "json", observe: "body"})
  }
}
