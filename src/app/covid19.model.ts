export interface Statistic {
  confirmed: number;
  deaths: number;
  recovered: number;
}
export interface StatisticCountry {
  countryregion: string;
  lastupdate: string;
  location: Location;
  countrycode: Countrycode;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface Countrycode {
  iso2: string;
  iso3: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface CountryCodeOption{
  label :string;
  value:string;
}

export interface TimeSeries{
  timeseries:{
    [key: string] : {
      confirmed: number
      deaths: number
      recovered: number
    }
  }
}
