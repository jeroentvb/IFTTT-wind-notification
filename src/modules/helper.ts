require('dotenv').config()

const windDirections = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW'
]

function getWindDirection (deg) {
  const val = Math.floor((deg / 22.5) + 0.5)
  return windDirections[(val % 16)]
}

function calcWinddirection (data) {
  const winddirection = []
  let average = 0
  let count = 0

  data.forEach(hour => {
    if (hour.windspeed >= (parseInt(process.env.WIND_THRESHOLD) ? parseInt(process.env.WIND_THRESHOLD) : 12)) {
      winddirection.push(hour.winddirection)
      average += hour.winddirection
      count++
    }
  })

  if (average === 0 || count < 3) {
    average = 0

    data.forEach(hour => {
      winddirection.push(hour.winddirection)
      average += hour.winddirection
    })
  }

  return Math.round(average / winddirection.length)
}

module.exports = {
  getWindDirection,
  calcWinddirection
}
