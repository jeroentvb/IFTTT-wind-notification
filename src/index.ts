require('dotenv').config()

import IFTTT from 'ifttt-webhooks-channel'
const ifttt = new IFTTT(process.env.MAKER_KEY as string);

(async function () {
  try {
    const res = await ifttt.post('wind_update', /*notification*/)
    console.log(res)
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
