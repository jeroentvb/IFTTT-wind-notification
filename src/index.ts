require('dotenv').config()

import config from './app-config'
import Spot from './modules/spot'
import Notification from './modules/notification'

import IFTTT from 'ifttt-webhooks-channel'
const ifttt = new IFTTT(process.env.MAKER_KEY as string)

const helper = require('jeroentvb-helper');

(async function () {
  const notification = new Notification()
  await checkSpot()
})()

async function checkSpot (index = 0): Promise<void> {
  try {
    const spot = new Spot(config.spots[index], config.windThreshold, config.time)
    await spot.getForecast()
    spot.checkWind()

    console.log(spot.parsedForecast)

    // const res = await ifttt.post('wind_update', /*notification*/)
    // console.log(res)
  } catch (err) {
    console.error(err)
  }
}

/* Steps */
// -- Get data
// -- Check if wind direction is sufficient
// -- Check if windspeed is sufficient
// Compose notification
// Send notification
