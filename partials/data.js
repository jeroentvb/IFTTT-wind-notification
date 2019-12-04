const config = require('../app-config.json')
const scrape = require('wind-scrape')
const helper = require('./helper')

async function get (spots) {
  try {
    const forecastData = []

    await Promise.all(spots.map(async (spot) => {
      const res = await scrape.windguru(spot.spotNumber, [spot.modelNumber])
      const parsedRes = parse(res)

      forecastData.push(parsedRes)
    }))

    return forecastData
  } catch (err) {
    throw new Error(err)
  }
}

function parse (data) {
  data.models = data.models[0]

  // Only use the first 3 days
  data.models.days = data.models.days.filter((day, i) => {
    if (i < 3) return true
  })

  // Only use day hours (8 - 20)
  data.models.days.forEach(day => {
    day.hours = day.hours.filter(hour => {
      if (hour.hour > 7 && hour.hour < 21) return true
    })
  })

  return data
}

function checkWindspeedThreshold (days) {
  const data = days.map(day => {
    const average = {
      windspeed: 0,
      winddirection: 0
    }
    let count = 0

    day.data.hours.forEach(hour => {
      if (hour.windspeed >= (config.windThreshold ? config.windThreshold : 14)) {
        count++

        average.windspeed += hour.windspeed
        average.winddirection += hour.winddirection
      }
    })

    average.windspeed = Math.round(average.windspeed / count)
    average.winddirection = Math.round(average.winddirection / count)

    day.average = average

    if (count >= 3) {
      return day
    } else {
      return undefined
    }
  })

  return data
}

function createNotification (data) {
  const notification = []

  data.forEach((day, i) => {
    let message

    if (day !== undefined) {
      if (i === 0) {
        message = 'Today'
      } else if (i === 1) {
        message = 'Tomorrow'
      } else if (i === 2) {
        message = 'The day after tomorrow'
      }

      notification.push(`\n\n${message} there will be an average windspeed of ${day.average.windspeed} kts at ${day.name}, blowing from the ${helper.getWindDirection(day.average.winddirection)}.`)
    }
  })

  return notification
}

function getWinddirections (spotForecast) {
  const forecast = []

  spotForecast[0].models.days.forEach(day => {
    forecast.push({
      winddirection: helper.calcWinddirection(day.hours)
    })
  })

  return forecast
}

function selectSpots (forecast) {
  forecast.forEach((spotForecast, i) => {
    config.spots.forEach((spot, j) => {
      if (spot.directionMin > spot.directionMax) {
        // Checking if the value is between e.g. 250 and 50

        if ((spotForecast.winddirection > spot.directionMin && spotForecast.winddirection <= 360) || (spotForecast.winddirection < spot.directionMax && spotForecast.winddirection >= 0)) {
          forecast[i].spot = spot.name
        }
      } else if (spotForecast.winddirection > spot.directionMin && spotForecast.winddirection < spot.directionMax) {
        forecast[i].spot = spot.name
      }
    })
  })

  return forecast
}

function getForecast (selectedSpots, spotForecast) {
  const forecastData = []

  selectedSpots.forEach((day, i) => {
    spotForecast.forEach(spotData => {
      if (spotData.spot.includes(day.spot)) {
        forecastData[i] = {
          name: day.spot,
          data: spotData.models.days[i]
        }
      }
    })
  })

  return forecastData
}

module.exports = {
  get,
  getWinddirections,
  selectSpots,
  getForecast,
  checkWindspeedThreshold,
  createNotification
}
