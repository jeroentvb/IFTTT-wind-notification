require('dotenv').config()

const scrape = require('wind-scrape')
const helper = require('./helper')

function get (spot, modelNumber) {
  return new Promise((resolve, reject) => {
    scrape.windguru(spot, modelNumber)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

function parse (data) {
  const notification = []

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

  // Do the math
  data.models.days.forEach((day, i) => {
    let count = 0
    let average = {
      windspeed: 0,
      winddirection: 0
    }

    day.hours.forEach(hour => {
      if (hour.windspeed >= process.env.WIND_THRESHOLD || 12) count++

      average.windspeed += hour.windspeed
      average.winddirection += hour.winddirection
    })

    average.windspeed = Math.round(average.windspeed / day.hours.length)
    average.winddirection = Math.round(average.winddirection / day.hours.length)

    if (count >= 3) {
      let message

      if (i === 0) {
        message = 'Today'
      } else if (i === 1) {
        message = 'Tomorrow'
      } else if (i === 2) {
        message = 'The day after tomorrow'
      }

      notification.push(`\n\n${message} there will be an average windspeed of ${average.windspeed} kts, blowing from the ${helper.getWindDirection(average.winddirection)}.`)
    }
  })

  return notification
}

module.exports = {
  get,
  parse
}
