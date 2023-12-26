import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import {SearchResult} from "./search-result";
import {ProjectFileSearchResult, SearchResultDownload} from "./project-file";

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

  getSearchResult(result_id: number, session_id: string) {
    return this.http.get<SearchResultDownload>(`${this.baseURL}/api/search_result/${result_id}/${session_id}/download`, {responseType: "json", observe: "body"})
  }
}
