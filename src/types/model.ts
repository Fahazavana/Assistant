export interface ModelDetails {
  parameter_size: string
  [key: string]: unknown
}

export interface Model {
  name: string
  model: string
  details: ModelDetails
}
