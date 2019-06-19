require('dotenv').config()

const scrape = require('wind-scrape')
const helper = require('./helper')

async function get (spots) {
  return new Promise(async (resolve, reject) => {
    try {
      let forecastData = []

      await Promise.all(spots.map(async (spot) => {
        const res = await scrape.windguru(spot.spotNumber, [spot.modelNumber])
        const parsedRes = parse(res)

        forecastData.push(parsedRes)
      }))

      resolve(forecastData)
    } catch (err) {
      reject(err)
    }
  })
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
    let count = 0
    let average = {
      windspeed: 0,
      winddirection: 0
    }

    day.data.hours.forEach(hour => {
      if (hour.windspeed >= (parseInt(process.env.WIND_THRESHOLD) ? parseInt(process.env.WIND_THRESHOLD) : 12)) {
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

module.exports = {
  get,
  checkWindspeedThreshold,
  createNotification
}
