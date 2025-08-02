// Simple test script to verify Gemini API key
// Run with: node test-api.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    console.log('Please set your API key:');
    console.log('1. Get your key from https://makersuite.google.com/app/apikey');
    console.log('2. Create a .env.local file with: GEMINI_API_KEY=your_key_here');
    return;
  }

  console.log('🔑 API Key found (first 10 chars):', apiKey.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('🤖 Testing Gemini API connection...');
    
    const result = await model.generateContent('Say "Hello, Resume Roaster is working!"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error(error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n💡 This usually means:');
      console.log('1. Your API key is incorrect');
      console.log('2. You need to get a new key from https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 This usually means:');
      console.log('1. You\'ve exceeded your API quota');
      console.log('2. Check your usage at https://makersuite.google.com/app/apikey');
    }
  }
}

testGeminiAPI(); 