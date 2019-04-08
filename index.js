require('dotenv').config()

const data = require('./partials/data')
const IFTTT = require('./partials/ifttt')
const ifttt = new IFTTT(process.env.MAKER_KEY);

(async function () {
  try {
    const windguru = await data.get(process.env.SPOT_NUMBER, [process.env.SPOT_MODELNUMBER])
    let notification = data.parse(windguru)

    const res = await ifttt.post('wind_update', notification)
    console.log(res)
  } catch (err) {
    console.error(err)
  }
})()
