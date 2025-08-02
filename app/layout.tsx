import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume Analyzer - Professional AI-Powered Resume Review',
  description: 'Get professional insights and actionable improvements for your resume powered by Google Gemini AI. Upload your PDF resume for detailed analysis and suggestions.',
  keywords: ['resume', 'analyzer', 'ai', 'feedback', 'professional', 'career', 'job search', 'resume review'],
  authors: [{ name: 'Kanit Mann' }],
  creator: 'Kanit Mann',
  openGraph: {
    title: 'Resume Analyzer - Professional AI-Powered Resume Review',
    description: 'Get professional insights and actionable improvements for your resume powered by Google Gemini AI.',
    type: 'website',
    url: 'https://resume-roaster.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Analyzer - Professional AI-Powered Resume Review',
    description: 'Get professional insights and actionable improvements for your resume powered by Google Gemini AI.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 