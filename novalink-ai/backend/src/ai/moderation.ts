import axios from 'axios'
import { logger } from '@utils/logger'

const HUGGING_FACE_API = 'https://api-inference.huggingface.co/models'
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY

// NSFW Content Detection
export const detectNSFW = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/Falconsai/nsfw_image_detection`,
      { inputs: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    )

    const result = response.data[0]
    return result.label === 'nsfw'
  } catch (error) {
    logger.error('NSFW detection error:', error)
    return false
  }
}

// Toxicity Detection
export const detectToxicity = async (text: string): Promise<number> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/michellejieli/NSFW_text_classifier`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    )

    const scores = response.data[0]
    const toxicityScore = scores.find((s: any) => s.label === 'NSFW')?.score || 0
    return toxicityScore
  } catch (error) {
    logger.error('Toxicity detection error:', error)
    return 0
  }
}

// Emotion Detection
export const detectEmotion = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/michellejieli/Emotion_Text_Classifier`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    )

    const emotions = response.data[0]
    const topEmotion = emotions.sort(
      (a: any, b: any) => b.score - a.score
    )[0]

    return topEmotion.label
  } catch (error) {
    logger.error('Emotion detection error:', error)
    return 'neutral'
  }
}

// Face Detection (Verification)
export const verifyFace = async (imageUrl: string): Promise<boolean> => {
  try {
    // Using a simple face detection model
    const response = await axios.post(
      `${HUGGING_FACE_API}/dima806/face_recognition`,
      { inputs: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    )

    return response.data && response.data.length > 0
  } catch (error) {
    logger.error('Face verification error:', error)
    return false
  }
}

export default {
  detectNSFW,
  detectToxicity,
  detectEmotion,
  verifyFace,
}
