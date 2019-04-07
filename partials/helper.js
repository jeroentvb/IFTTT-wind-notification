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

module.exports = {
  getWindDirection
}
