import { WindguruModelHour } from 'wind-scrape/dist/interfaces/windguru'


export interface ISpot {
  number: number
  models: [string, string, string]
  direction: {
    min: number
    max: number
  }
}

export interface AppConfig {
  spots: ISpot[]
  windThreshold: number
  time: {
    min: number
    max: number
  }
}

export interface ParsedForecast {
  model: string
  date: string
  hours: WindguruModelHour[]
  valid?: boolean
}