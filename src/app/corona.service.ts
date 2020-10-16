import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoronaService {

  URL ="https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/brief"
  constructor(private http: HttpClient) {

  }
  searchWorldWide(){
    return this.http.get(this.URL,{
      headers:{
        accept: "application/json"
      }
    })
  }
}
