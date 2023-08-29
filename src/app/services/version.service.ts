import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  apiURL = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getCurrentVersion(): Observable<any> {
    // Accept-Encoding: gzip, deflate
    // Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
    // Connection: keep-alive
    // Content-Length: 497
    // Content-Type: application/json;charset=UTF-8
    // const headers = new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'});
    // headers.append('Accept-Encoding', 'gzip ');
    return this.httpClient.get(`${this.apiURL}/version`);
  }
}
