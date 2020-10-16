import {
  Component,
  OnInit
} from '@angular/core';
import { tileLayer, latLng, circle, marker, polygon } from 'leaflet';
import { ChartLine } from './chart/chart.model';
import {
  SearchAPIWorld
} from './corona.model';
import {
  CoronaService
} from './corona.service';
import {
  CountryCodeOption,
  Statistic,
  StatisticCountry,
  TimeSeries
} from './covid19.model';
import {
  Covid19Service
} from './covid19.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'corona';
  worldWideData: Statistic;
  countryData: StatisticCountry[];
  countryCodes: CountryCodeOption[]=[];
  selectedCountry: string = 'VN';
  regional: StatisticCountry;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],

  };
  layers = [];
  rate =0.1;
  center= latLng(0,0);
  zoom= 1;
  timeSeries: TimeSeries[];
  chartLine: ChartLine[] = [];

  constructor(private covid19Service: Covid19Service) {

  }
  async ngOnInit() {
    const data = await this.covid19Service.getStatisticWorldWide().toPromise() as Statistic;
    this.worldWideData = data;
    this.countryData = await this.covid19Service.getStatisticByCountry().toPromise() as StatisticCountry[];
    console.log(this.countryData)
    this.countryCodes = this.countryData.map((data) => ({
      label: data.countryregion,
      value: data.countrycode?.iso2
    }))
    this.regional = this.countryData.find((c)=>c.countrycode?.iso2 == this.selectedCountry);

    this.countryData.forEach((data)=>{
      this.layers.push(circle([ data.location.lat,data.location.lng ], { radius: Math.floor(Math.sqrt(data.confirmed)*1000),fillColor:'red',stroke:false }))
      //this.layers.push(marker([data.location.lat,data.location.lng ],{title: ''+data.confirmed}))
    })
    this.layers.push(marker([0,0],{opacity:0}));

    this.timeSeries = await this.covid19Service.getTimeSeries().toPromise() as TimeSeries[];
    console.log(this.timeSeries)

    const confirmedLine: ChartLine = {
      name: 'Confirmed',
      series: []
    }
    const recoverLine: ChartLine = {
      name: 'Recovery',
      series: []
    }
    const deathsLine: ChartLine = {
      name: 'Deaths',
      series: []
    }

    const confirmedCase = {};
    const recoverCase = {};
    const deathsCase = {};

    this.timeSeries.forEach(t => {
      const latestKeys = this.getLatest(t.timeseries);

      latestKeys.forEach(key => {
        if (confirmedCase[key] == undefined) {
          confirmedCase[key] = 0;
        } else {
          confirmedCase[key] += t.timeseries[key].confirmed;
        }

        if (recoverCase[key] == undefined) {
          recoverCase[key] = 0;
        } else {
          recoverCase[key] += t.timeseries[key].recovered;
        }

        if (deathsCase[key] == undefined) {
          deathsCase[key] = 0;
        } else {
          deathsCase[key] += t.timeseries[key].deaths;
        }
      })
      // console.log(t.timeseries[latestKeys[0]]); // ?
    });
    console.log(confirmedCase)

    confirmedLine.series = Object.keys(confirmedCase).map(key => {
      return {
        name: key,
        value: confirmedCase[key]
      }
    });

    recoverLine.series = Object.keys(recoverCase).map(key => {
      return {
        name: key,
        value: recoverCase[key]
      }
    });

    deathsLine.series = Object.keys(deathsCase).map(key => {
      return {
        name: key,
        value: deathsCase[key]
      }
    });

    this.chartLine.push(confirmedLine, recoverLine, deathsLine);
  }
  getLatest(timeseries: { [key: string]: { confirmed: number; deaths: number; recovered: number; }; }) {
    const keys = Object.keys(timeseries); ['1/1/20'];

    const latestKeys = keys.slice(keys.length - 10, keys.length - 1);

    return latestKeys;
  }

  selectCountry(country:string){
    this.selectedCountry = country;
    this.regional = this.countryData.find((c)=>c.countrycode?.iso2 == this.selectedCountry);
    this.center = latLng(this.regional.location.lat, this.regional.location.lng)
    this.zoom = 3;
    this.layers.pop();
    this.layers.push(marker([this.regional.location.lat,this.regional.location.lng ],{title: ''+this.regional.confirmed}))

  }

}
