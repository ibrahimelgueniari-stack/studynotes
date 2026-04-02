import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/services/ai'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const result = await aiService.analyzeAndGenerate(content)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}
