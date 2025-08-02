'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Loader, Sparkles, Target, Sword, MessageSquare } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface RoastResult {
  roast: string
  suggestions: string[]
  score: number
}

const funnyAdlibs = [
  "🔍 Analyzing your resume with precision...",
  "🤖 AI brain cells are working overtime...",
  "💼 Professional assessment in progress...",
  "📊 Evaluating your career choices...",
  "⚡ Processing with lightning speed...",
  "🧠 Deep learning in action...",
  "📈 Calculating your potential...",
  "🔍 Sherlock Holmes mode activated...",
  "🎯 Targeting improvement areas...",
  "🚀 Preparing detailed feedback...",
  "📝 Crafting personalized insights...",
  "💡 Generating actionable advice...",
  "📋 Reviewing your experience...",
  "🎯 Focusing on key areas...",
  "⚡ Electrifying analysis in progress...",
  "🔍 Examining every detail...",
  "💼 Professional evaluation ongoing...",
  "📊 Data-driven insights coming...",
  "🎯 Precision targeting...",
  "💡 Smart recommendations loading..."
]

const scoreReactions = {
  excellent: {
    emoji: "🏆",
    message: "Impressive! Your resume shows strong potential with room for refinement.",
    color: "text-green-600"
  },
  good: {
    emoji: "👍",
    message: "Good foundation! Here are some areas to enhance your impact.",
    color: "text-blue-600"
  },
  poor: {
    emoji: "📝",
    message: "Room for improvement! Let's make your resume shine.",
    color: "text-yellow-600"
  },
  terrible: {
    emoji: "💡",
    message: "Great opportunity for growth! These improvements will make a difference.",
    color: "text-orange-600"
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentAdlib, setCurrentAdlib] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef<HTMLDivElement | null>(null)

  // Confetti effect
  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  // Rotating adlibs during loading
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      let index = 0
      setCurrentAdlib(funnyAdlibs[0])
      interval = setInterval(() => {
        index = (index + 1) % funnyAdlibs.length
        setCurrentAdlib(funnyAdlibs[index])
      }, 2000)
    } else {
      setCurrentAdlib('')
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
      setRoastResult(null)
    } else {
      setError('Please select a valid PDF file')
      setFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = 'Unknown error'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`
          console.error('API Error Response:', errorData)
        } catch (jsonError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
          console.error('Failed to parse error response:', jsonError)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Roast result:', result)
      setRoastResult(result)
      
      // Trigger confetti for excellent scores
      if (result.score >= 8) {
        triggerConfetti()
      }
    } catch (err) {
      console.error('Error during roast:', err)
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreReaction = (score: number) => {
    if (score >= 8) return scoreReactions.excellent
    if (score >= 6) return scoreReactions.good
    if (score >= 4) return scoreReactions.poor
    return scoreReactions.terrible
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🏆', '💡', '📈', '🎯', '⚡', '💼', '📊', '🔍', '🎉', '✨', '💪', '🚀'][Math.floor(Math.random() * 12)]}
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold gradient-text">
              Resume Analyzer
            </h1>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xl text-body max-w-4xl mx-auto mb-8 leading-relaxed">
            Upload your resume and get professional insights powered by{' '}
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-primary-text font-semibold">
              <span>Google</span>
              <span className="text-sm">Gemini</span>
            </span>{' '}
            AI for actionable improvements! 💼
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="card">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="text-center">
                <div className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary transition-all duration-300 hover:bg-accent">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6 animate-bounce-slow" />
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-heading">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-muted">
                      Only PDF files are supported
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block mt-8 cursor-pointer hover:scale-105 transition-transform btn-primary"
                  >
                    Choose PDF File
                  </label>
                </div>
                {file && (
                  <div className="mt-6 flex items-center justify-center gap-3 text-green-600 animate-pulse">
                    <FileText className="w-6 h-6" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-xl p-4 animate-shake">
                  <p className="text-destructive text-center">{error}</p>
                </div>
              )}

              {/* Loading Animation */}
              {isLoading && (
                <div className="text-center space-y-8 mt-8">
                  <div className="flex items-center justify-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-lg font-semibold text-primary animate-pulse">
                      {currentAdlib}
                    </span>
                  </div>
                  <div className="loading-dots">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="loading-dot"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <button
                  type="submit"
                  disabled={!file || isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 mx-auto hover:scale-105 transition-transform btn-primary text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6" />
                      Analyze My Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {roastResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Score Card */}
            <div className="max-w-4xl mx-auto">
              <div className="card">
                <div className="text-center p-12">
                  <div className="text-6xl mb-8 animate-bounce">
                    {getScoreReaction(roastResult.score).emoji}
                  </div>
                  <h2 className="text-3xl font-bold mb-6 text-heading">Analysis Score</h2>
                  <div className={`score-display ${getScoreReaction(roastResult.score).color} mb-8`}>
                    {roastResult.score}/10
                  </div>
                  <p className="text-body text-lg leading-relaxed">
                    {getScoreReaction(roastResult.score).message}
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="max-w-5xl mx-auto">
              <div className="card">
                <div className="p-12">
                  <h3 className="text-2xl font-bold mb-10 flex items-center gap-4 text-heading">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary-foreground" />
                    </div>
                    Professional Analysis
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Sword className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </h3>
                  
                  {/* Analysis Text */}
                  <div className="roast-card mb-10">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {roastResult.roast.split('\n\n').map((paragraph, index) => {
                        const trimmedParagraph = paragraph.trim()
                        return trimmedParagraph ? (
                          <p key={index} className="text-heading leading-relaxed text-lg font-medium mb-6 last:mb-0">
                            {trimmedParagraph}
                          </p>
                        ) : null
                      })}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-xl font-semibold mb-8 flex items-center gap-3 text-heading">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                      </div>
                      Improvement Suggestions:
                    </h4>
                    <div className="grid gap-4">
                      {roastResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-item">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className="text-heading text-base leading-relaxed">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Try Again Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setFile(null)
                  setRoastResult(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  )
} 