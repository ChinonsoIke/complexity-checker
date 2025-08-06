export interface GeminiRequest {
  contents: Content[]
  generationConfig: GenerationConfig
}

export interface GeminiResponse {
  candidates: Candidate[]
}
export interface Candidate {
  content: Content
}

export interface Content {
  parts: Part[]
}

export interface Part {
  text: string
}

export interface GenerationConfig {
  temperature: number
  responseMimeType: string
}

export interface Complexity {
  timeComplexity: string
  spaceComplexity: string
  explanation: string
}

export interface ApiRequest {
  code: string
}