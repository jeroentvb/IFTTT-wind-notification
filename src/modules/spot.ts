import * as scrape from 'wind-scrape'

import { WindguruData } from 'wind-scrape'
import { WindguruModel, WindguruModelHour } from 'wind-scrape/dist/interfaces/windguru'
import { AppConfig, ISpot, ParsedForecast } from '../interfaces'

const spotData: scrape.WindguruData = require('../../data-export.json')

export default class Spot {
  private spot: ISpot
  private windThreshold: AppConfig['windThreshold']
  private time: AppConfig['time']
  forecast: WindguruModel[] = []
  parsedForecast: ParsedForecast[] = []
  metaData: Partial<WindguruData['spot']> = {}

  constructor (spot: ISpot, windThreshold: AppConfig['windThreshold'], time: AppConfig['time']) {
    this.spot = spot
    this.windThreshold = windThreshold
    this.time = time
  }

  async getForecast (): Promise<void> {
    // const spotData = await scrape.windguru(this.spot.number)
    this.metaData = spotData.spot
    this.forecast = spotData.models
      .filter(model => this.spot.models.findIndex(modelName => {        
        return modelName === model.name
      }) !== -1)
      .map(model => this.filterHours(model))
    
    this.parsedForecast = this.spot.models.map((modelName, dayNumber) => {
      const forecastModel = this.forecast.find(model => model!.name === modelName)

      return {
        model: forecastModel!.name,
        date: forecastModel!.days[dayNumber].date,
        hours: forecastModel!.days[dayNumber].hours
      }
    })
  }

  /**
   * Remove specified hours. E.g. all below 8am and above 8 pm
   */
  private filterHours (model: WindguruModel) {
    return {
      ...model,
      days: model.days.map(day => {
        return {
          ...day,
          hours: day.hours.filter(hour => {
            return parseInt(hour.hour) >= this.time.min && parseInt(hour.hour) <= this.time.max
          })
        }
      })
    }
  }

  /**
   * Check the wind speed and direction based on the app-config
   * Filters hours that don't meet the wind direction and speed requirements
   */
  checkWind () {
    this.parsedForecast = this.parsedForecast.map((day: ParsedForecast) => {
      const filteredWinddirectionHours = this.filterWinddirection(day.hours)
      const hours = this.filterWindspeed(filteredWinddirectionHours)

      return {
        ...day,
        hours,
        valid: hours.length >= 3
      }
    })
  }

  /**
   * Filter hours in a day based on the wind direction
   * If the wind direction is between the given min and max it will stay
   */
  private filterWinddirection (hours: WindguruModelHour[]): WindguruModelHour[] {
    const { min, max } = this.spot.direction

    return hours.filter(hour => {
      const winddirection: number = parseInt(hour.wdeg)
      const betweenMinAnd360: boolean = winddirection > min && winddirection <= 360
      const betweenMaxAnd0: boolean = winddirection < max && winddirection >= 0

      if (min > max) {
        // Checking if the value is between e.g. 250 and 50
        if (betweenMinAnd360 || betweenMaxAnd0) {
          return true
        }
      } else if (winddirection > min && winddirection < max) {
        return true
      }

      return false
    })
  }

  /**
   * Filter hours in a day based on the given wind threshold
   */
  private filterWindspeed (hours: WindguruModelHour[]): WindguruModelHour[] {
    return hours.filter(hour => parseInt(hour.wspd) >= this.windThreshold)
  }
}
