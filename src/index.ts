require('dotenv').config()

import config from './app-config.json';
import data from './modules/data'
import IFTTT from 'ifttt-webhooks-channel'
const ifttt = new IFTTT(process.env.MAKER_KEY as string);

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

/* Steps */
// Get data
// Check if wind direction is sufficient
// Check if windspeed is sufficient
// Compose notification
// Send notification
