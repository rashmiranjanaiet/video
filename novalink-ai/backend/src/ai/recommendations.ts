import OpenAI from 'openai'
import { logger } from '@utils/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate conversation starters
export const generateConversationStarters = async (interests: string[]): Promise<string[]> => {
  try {
    const prompt = `Generate 5 creative conversation starters for someone interested in: ${interests.join(', ')}. Make them engaging and fun.`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
    })

    const content = response.choices[0].message?.content || ''
    return content.split('\n').filter((line: string) => line.trim())
  } catch (error) {
    logger.error('Error generating conversation starters:', error)
    return [
      'What brings you here today?',
      'What are your hobbies?',
      'Tell me something interesting about yourself!',
    ]
  }
}

// Personality matching analysis
export const analyzePersonalityMatch = async (
  user1Interests: string[],
  user2Interests: string[],
  user1Bio: string,
  user2Bio: string
): Promise<{ score: number; reason: string }> => {
  try {
    const prompt = `
    Analyze how compatible these two people might be:
    Person 1 - Interests: ${user1Interests.join(', ')}, Bio: ${user1Bio}
    Person 2 - Interests: ${user2Interests.join(', ')}, Bio: ${user2Bio}
    
    Provide a compatibility score (0-100) and brief reason.
    Response format: {"score": number, "reason": "string"}
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
    })

    const content = response.choices[0].message?.content || '{}'
    const result = JSON.parse(content)

    return {
      score: Math.min(result.score, 100),
      reason: result.reason,
    }
  } catch (error) {
    logger.error('Error analyzing personality match:', error)
    return { score: 50, reason: 'Unable to analyze' }
  }
}

// AI chat assistant
export const generateChatResponse = async (userMessage: string, context?: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly NovaLink AI assistant helping users have great conversations. Keep responses concise and engaging.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 150,
    })

    return response.choices[0].message?.content || 'Sorry, I could not respond.'
  } catch (error) {
    logger.error('Error generating chat response:', error)
    return 'I am having trouble responding right now. Please try again later.'
  }
}

export default {
  generateConversationStarters,
  analyzePersonalityMatch,
  generateChatResponse,
}
