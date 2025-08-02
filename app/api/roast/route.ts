import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const roastPrompts = [
  `You are an elite resume consultant with a wicked sense of humor—a master of blending sharp wit with real-world advice.

Resume content:
{resumeText}

Please provide your response in the following JSON format:
{
  "roast": "A hilariously brutal yet constructive 2-3 paragraph review. Be ruthlessly witty about specific issues you find. Use clever metaphors, pop culture references, and sharp observations. Be brutal but constructive. Use \\n\\n between paragraphs for proper formatting.",
  "suggestions": ["3-5 practical, prioritized improvements"],
  "score": "A score from 1-10 where 1 is terrible and 10 is excellent"
}

ROASTING TARGETS:
• Buzzword bingo disasters ("synergistic solutions," "passionate self-starter")
• Vague achievements without numbers ("increased sales significantly") 
• Formatting nightmares and readability issues
• Generic job descriptions that could apply to anyone
• Glaring omissions (contact info, relevant skills, dates)
• Grammar catastrophes and typos
• Inflated claims that scream "fake it till you make it"

TONE: Sharp and savage, but ultimately helpful. Think "brutal best friend" not "internet troll."`,

  `You are a SAVAGE stand-up comedian who specializes in brutally roasting resumes. Your job is to analyze this resume and deliver a HILARIOUSLY BRUTAL roast that's absolutely savage but still entertaining. Think of yourself as a brutally honest career coach who doesn't hold back.

Resume content:
{resumeText}

Please provide your response in the following JSON format:
{
  "roast": "A SAVAGE 2-3 paragraph roast of the resume. Be BRUTAL, use savage humor, puns, and absolutely destroy the resume with wit. Make it MEMORABLY BRUTAL! IMPORTANT: Use double line breaks (\\n\\n) to separate paragraphs for proper formatting.",
  "suggestions": ["3-5 specific, actionable suggestions for improvement"],
  "score": "A score from 1-10 where 1 is terrible and 10 is excellent"
}

Be absolutely BRUTAL about:
- Overused buzzwords and corporate jargon (call them out!)
- Lack of quantifiable achievements (savage about it!)
- Poor formatting and readability (destroy it!)
- Generic descriptions (roast them!)
- Missing important details (point out the gaps!)
- Typos and grammar issues (savage!)
- Unrealistic claims (call BS!)

Make the roast SAVAGE and BRUTAL, but keep it entertaining and constructive. Be absolutely ruthless!`,

  `You are a SAVAGE AI resume critic with the personality of a brutally honest career coach who's seen it all and doesn't sugarcoat anything. Analyze this resume and give it a HILARIOUSLY BRUTAL roast.

Resume content:
{resumeText}

Please provide your response in the following JSON format:
{
  "roast": "A SAVAGE 2-3 paragraph roast that's both brutally honest and hilariously savage. Use savage humor, sarcasm, and absolutely destroy the resume with clever observations. IMPORTANT: Use double line breaks (\\n\\n) to separate paragraphs for proper formatting.",
  "suggestions": ["3-5 specific suggestions for improvement"],
  "score": "A score from 1-10 where 1 is terrible and 10 is excellent"
}

Be absolutely BRUTAL and SAVAGE with your roasting style - use metaphors, analogies, and pop culture references to absolutely destroy this resume. Make it memorable and shareable because it's so savage!`
]

export async function POST(request: NextRequest) {
  console.log('🔥 Roast API route hit!')
  
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('resume') as File

    console.log('📁 File received:', file?.name, file?.size, file?.type)

    if (!file) {
      console.log('❌ No file uploaded')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed')

    // For now, use a mock resume text since PDF parsing is causing issues
    const mockResumeText = `KANIT MANN
Intern - Computational Pathology and AI
[This is a mock resume text since PDF parsing is temporarily disabled]`

    console.log('📝 Using mock resume text for testing')

    // Generate roast using Gemini with random prompt selection
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const randomPrompt = roastPrompts[Math.floor(Math.random() * roastPrompts.length)]
    const prompt = randomPrompt.replace('{resumeText}', mockResumeText)

    console.log('🤖 Sending request to Gemini API...')

    let result
    try {
      result = await model.generateContent(prompt)
    } catch (geminiError) {
      console.error('❌ Gemini API error:', geminiError)
      return NextResponse.json(
        { error: 'Failed to generate roast. Please check your API key and try again.' },
        { status: 500 }
      )
    }

    const response = await result.response
    const text = response.text()

    console.log('✅ Gemini response received, length:', text.length)

    // Try to parse the JSON response
    let roastData
    try {
      // Extract JSON from the response (in case Gemini adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        roastData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError)
      console.log('Raw response text:', text)
      // If parsing fails, create a fallback response
      roastData = {
        roast: text || "This resume is so bland, even a robot couldn't find anything interesting to say about it. But hey, at least you tried! Maybe add some personality next time?",
        suggestions: [
          "Add more specific achievements with numbers and metrics",
          "Remove generic buzzwords like 'synergy' and 'leverage'",
          "Improve formatting and make it more visually appealing",
          "Include relevant keywords for your target industry",
          "Add a compelling summary that tells your story"
        ],
        score: 5
      }
    }

    // Ensure the response has the expected structure and add some flair
    let roastText = roastData.roast || "This resume needs some serious work! It's like a blank canvas - lots of potential, but currently just... blank. Time to paint a masterpiece!"
    
    // Ensure proper paragraph formatting
    // Replace single line breaks with double line breaks for better paragraph separation
    roastText = roastText.replace(/\n(?!\n)/g, '\n\n')
    // Remove any triple or more line breaks
    roastText = roastText.replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    roastText = roastText.trim()
    
    const finalResponse = {
      roast: roastText,
      suggestions: Array.isArray(roastData.suggestions) ? roastData.suggestions : [
        "Add more specific achievements with numbers",
        "Remove generic buzzwords",
        "Improve formatting and readability",
        "Include relevant keywords for your industry",
        "Add a compelling summary"
      ],
      score: typeof roastData.score === 'number' ? Math.max(1, Math.min(10, roastData.score)) : 5
    }

    console.log('🎯 Sending final response with score:', finalResponse.score)
    return NextResponse.json(finalResponse)

  } catch (error) {
    console.error('💥 Unexpected error processing resume:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
} 