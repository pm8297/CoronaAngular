import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeSeries } from './covid19.model';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  WORLDWIDE = "https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/brief"
  COUNTRIES = "https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/latest?onlyCountries=true"
  constructor(private http: HttpClient) { }

  getStatisticWorldWide(){
    return this.http.get(this.WORLDWIDE)
  }
  getStatisticByCountry(){
    return this.http.get(this.COUNTRIES)
  }
  getTimeSeries(): any{
    return this.http.get("https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/timeseries?onlyCountries=true")
  }
}
