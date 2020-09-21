export interface Spot {
  number: number
  model: string
  direction: {
    min: number
    max: number
  }
}
