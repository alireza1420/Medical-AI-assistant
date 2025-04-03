# Medical AI Assistant

A web application that helps doctors analyze medical tests and imaging using AI (ChatGPT or Gemini). The application provides AI-powered insights to assist medical professionals in making better clinical decisions.

## Features

- Choose between ChatGPT and Gemini AI models
- Analyze various types of medical data (MRI, blood tests, etc.)
- Clear and structured analysis output
- Modern and user-friendly interface
- Secure API key management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key
- Google Gemini API key

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```
4. Create a `.env` file in the root directory with your API keys:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run client
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select your preferred AI model (ChatGPT or Gemini)
2. Enter the medical data you want to analyze
3. Click "Analyze" to get AI-powered insights
4. Review the analysis results

## Security Notes

- Never commit your `.env` file or expose your API keys
- This application is intended for medical professionals only
- Always verify AI suggestions with clinical judgment
- Ensure patient data is properly anonymized before analysis

## Disclaimer

This tool is designed to assist medical professionals and should not be used as a sole source for medical decisions. Always verify AI-generated insights with clinical expertise and follow established medical protocols. # Medical-AI-assistant
