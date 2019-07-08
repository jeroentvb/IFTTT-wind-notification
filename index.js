require('dotenv').config()

const config = require('./app-config.json')
const data = require('./partials/data')
const IFTTT = require('./partials/ifttt')
const ifttt = new IFTTT(process.env.MAKER_KEY);

(async function () {
  try {
    const spotForecast = await data.get(config.spots)
    const forecast = data.getWinddirections(spotForecast)
    const selectedSpots = data.selectSpots(forecast)
    const forecastData = data.getForecast(selectedSpots, spotForecast)
    const parsedData = data.checkWindspeedThreshold(forecastData)
    const notification = data.createNotification(parsedData)

    if (notification.length > 0) {
      const res = await ifttt.post('wind_update', notification)
      console.log(res)
    }
  } catch (err) {
    console.error(err)
  }
})()
