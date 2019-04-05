const scrape = require('wind-scrape')
const fetch = require('node-fetch')

require('dotenv').config()

async function init () {
  try {
    const windfinder = await scrape.windfinder('markermeer_schellinkhout')
    const result = await fetch(`https://maker.ifttt.com/trigger/update/with/key/${process.env.MAKER_KEY}`, {
      method: 'post',
      body: JSON.stringify({
        value1: windfinder.name,
        value2: windfinder.spot,
        value3: 'test'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

init()
