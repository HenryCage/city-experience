import { VoyageAIClient } from 'voyageai'

export const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
})