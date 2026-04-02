import { NextRequest, NextResponse } from 'next/server'
import { ocrService } from '@/services/ocr'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const extractedText = await ocrService.extractTextFromImage(imageUrl)

    return NextResponse.json({ text: extractedText }, { status: 200 })
  } catch (error) {
    console.error('OCR API Error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from image' },
      { status: 500 }
    )
  }
}
