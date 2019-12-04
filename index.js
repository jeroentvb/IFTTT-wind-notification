require('dotenv').config()

const config = require('./app-config.json')
const data = require('./modules/data')
const IFTTT = require('./modules/ifttt')
const helper = require('jeroentvb-helper')
const ifttt = new IFTTT(process.env.MAKER_KEY)
const date = new Date();

(async function () {
  console.log('[IFTTT-wind-notifier] running...')
  try {
    const spotForecast = await data.get(config.spots)
    const forecast = data.getWinddirections(spotForecast)
    const selectedSpots = data.selectSpots(forecast)
    const forecastData = data.getForecast(selectedSpots, spotForecast)
    const parsedData = data.checkWindspeedThreshold(forecastData)
    const notification = data.createNotification(parsedData)

    if (notification.length > 0) {
      const res = await ifttt.post('wind_update', notification)

      // Not everything is exported..
      helper.exportToFile(`logs/response_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`, res)
      helper.exportToFile(`logs/notification_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`, notification)

      console.log(notification)
      console.log(res)

      if (res.status !== 200) {
        throw new Error(`Delivering the notification failed with status ${res.status}.`)
      }
    }
  } catch (err) {
    helper.exportToFile(`logs/error_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`, err)
    console.error(err)
  }
})()
