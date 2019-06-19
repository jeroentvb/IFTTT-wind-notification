require('dotenv').config()

const config = require('./app-config.json')
const data = require('./partials/data')
const IFTTT = require('./partials/ifttt')
const helper = require('./partials/helper')
const ifttt = new IFTTT(process.env.MAKER_KEY)
const helper2 = require('jeroentvb-helper');

// const spotForecast = require('./data-export.json');

(async function () {
  try {
    const forecast = []
    const notificationData = []
    let realNotificationData

    const spotForecast = await data.get(config.spots)

    // Get the winddirections and store them in [winddirection]
    spotForecast[0].models.days.forEach((day, i) => {
      forecast.push({
        winddirection: helper.calcWinddirection(day.hours)
      })
    })

    // Get the spots based on the winddirection
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

    console.log(forecast)

    // Get the forecast data for the spot
    forecast.forEach((day, i) => {
      spotForecast.forEach(spotData => {
        if (spotData.spot.includes(day.spot)) {
          notificationData[i] = {
            name: day.spot,
            data: spotData.models.days[i]
          }
        }
      })
    })

    realNotificationData = data.checkWindspeedThreshold(notificationData)

    const notification = data.createNotification(realNotificationData)

    console.log(notification)

    if (notification.length > 0) {
      const res = await ifttt.post('wind_update', notification)
      console.log(res)
    }
  } catch (err) {
    console.error(err)
  }
})()
