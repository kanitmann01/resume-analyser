# Resume Roaster 🔥

A hilarious web application that uses Google's Gemini AI to roast resumes with witty feedback and constructive suggestions. Get brutally honest feedback on your resume with a touch of humor!

## Features

- 📄 **PDF Upload**: Drag and drop or browse to upload your resume
- 🤖 **AI-Powered Roasting**: Uses Gemini API for intelligent and humorous feedback
- 🎯 **Scoring System**: Get a roast score from 1-10 with emoji reactions
- 💡 **Constructive Suggestions**: Receive actionable tips to improve your resume
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations and dark mode
- ⚡ **Real-time Processing**: Fast and efficient resume analysis
- 🌙 **Theme Support**: Light and dark mode with automatic detection

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI**: Google Gemini API (gemini-1.5-flash)
- **PDF Processing**: pdf-parse (ready for implementation)
- **Icons**: Lucide React + React Simple Icons
- **Theme**: next-themes for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-roaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Get your Gemini API key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env.local` file
   - Make sure to enable the Gemini API in your Google Cloud Console

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload your resume**: Click "Choose PDF File" or drag and drop your resume
2. **Get analyzed**: Click "Analyze My Resume" to start the AI analysis
3. **Review results**: See your analysis score, professional feedback, and improvement suggestions
4. **Try again**: Upload another resume for more analysis fun!

## Current Status

⚠️ **Note**: PDF parsing is currently disabled for testing. The application uses mock resume data to demonstrate the AI roasting functionality. Real PDF parsing will be implemented in future updates.

## API Endpoints

### POST /api/roast
Uploads and analyzes a resume PDF.

**Request:**
- `resume`: PDF file (multipart/form-data)

**Response:**
```json
{
  "roast": "A professional analysis with constructive feedback",
  "suggestions": ["Array of improvement suggestions"],
  "score": 7
}
```

**Error Responses:**
```json
{
  "error": "Error message describing the issue"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
resume-roaster/
├── app/
│   ├── api/roast/route.ts    # API endpoint for resume analysis
│   ├── globals.css           # Global styles and animations
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Main page component
├── components/
│   ├── theme-provider.tsx    # Theme context provider
│   ├── theme-toggle.tsx      # Dark/light mode toggle
│   └── ui/button.tsx         # Reusable button component
├── lib/
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── env.example              # Environment variables template
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini API for the AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for the beautiful styling system
- Lucide React for the beautiful icons
- next-themes for dark mode support

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your `GEMINI_API_KEY` is correctly set in `.env.local`
2. **Build Errors**: The project is configured to ignore TypeScript and ESLint errors during build for development purposes
3. **PDF Upload Issues**: Currently using mock data - real PDF parsing will be implemented soon

### Development Notes

- The application uses mock resume data for testing
- PDF parsing functionality is ready but disabled for demo purposes
- All AI responses are properly formatted with paragraph separation
- Dark/light mode is fully functional

---

**Disclaimer**: This application is for entertainment and educational purposes. While the feedback is meant to be humorous, it also provides constructive suggestions for resume improvement. Use at your own risk! 😄 