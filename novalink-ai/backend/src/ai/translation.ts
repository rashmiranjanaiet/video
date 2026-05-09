import axios from 'axios'
import { logger } from '@utils/logger'

const GOOGLE_TRANSLATE_API = 'https://translation.googleapis.com/language/translate/v2'
const GOOGLE_TRANSLATE_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

// Translate text to target language
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> => {
  try {
    const response = await axios.post(GOOGLE_TRANSLATE_API, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: GOOGLE_TRANSLATE_KEY,
        ...(sourceLanguage && { source: sourceLanguage }),
      },
    })

    return response.data.data.translations[0].translatedText
  } catch (error) {
    logger.error('Translation error:', error)
    return text
  }
}

// Detect language
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://www.googleapis.com/language/translate/v2/detect',
      null,
      {
        params: {
          q: text,
          key: GOOGLE_TRANSLATE_KEY,
        },
      }
    )

    return response.data.data.detections[0][0].language
  } catch (error) {
    logger.error('Language detection error:', error)
    return 'en'
  }
}

// Translate multiple languages
export const translateToMultipleLanguages = async (
  text: string,
  languages: string[]
): Promise<Record<string, string>> => {
  const translations: Record<string, string> = {}

  for (const lang of languages) {
    translations[lang] = await translateText(text, lang)
  }

  return translations
}

export default {
  translateText,
  detectLanguage,
  translateToMultipleLanguages,
}
