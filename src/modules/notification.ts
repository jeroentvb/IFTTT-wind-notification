import { winddirections } from '../constants'

import { ParsedForecast } from '../interfaces'
import Spot from './spot';

interface AverageWinddirection {
  string: string
  degrees: number
}

export default class Notification {
  messages: string[] = []

  add (spot: Spot) {
    spot.parsedForecast.forEach((day: ParsedForecast, i: number) => {
      if (day.valid && !this.messages[i]) {
        // const msg = this.constructNotification(day, spot.metaData)
        // this.messages.push(msg)

        console.log(this.calcAverageWinddirection(day.hours))
        
      }
    })
  }

  private constructNotification (forecast: ParsedForecast, spotInfo: Spot['metaData']): string {
    const msg = `${forecast.date} there will be win`
  }

  private calcAverageWinddirection (hours: ParsedForecast['hours']): AverageWinddirection {
    const averageWinddirection = this.calcAverage(hours, 'wdeg')
    const val = Math.floor((averageWinddirection / 22.5) + 0.5)
    
    return {
      string: winddirections[(val % 16)],
      degrees: averageWinddirection
    }
  }

  private calcAverage (hours: ParsedForecast['hours'], key: string): number {
    const numbers = hours.map(hour => parseInt(hour[key]))
    const average = numbers.reduce((previous, current) => previous + current) / numbers.length

    return Math.round(average)
  }
}