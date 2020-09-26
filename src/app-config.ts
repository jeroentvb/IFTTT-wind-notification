import { AppConfig } from './interfaces'

const config: AppConfig = {
  spots: [
    {
      // Tarifa
      number: 43, 
      models: [
        'ICON 7 km',
        'ICON 7 km',
        'ICON 13 km'
      ],
      direction: {
        min: 90,
        max: 315
      }
    },
    {
      // Gulf of Roses
      number: 551863, 
      models: [
        'ICON 7 km',
        'ICON 7 km',
        'ICON 13 km'
      ],
      direction: {
        min: 45,
        max: 135
      }
    }
  ],
  windThreshold: 8,
  time: {
    min: 9,
    max: 20
  }
}

export default config
