require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Medical analysis prompt template
const MEDICAL_PROMPT = `You are a medical AI assistant helping doctors analyze medical tests and imaging. 
Please analyze the following medical data and provide:
1. Key findings and observations
2. Potential diagnoses or concerns
3. Recommended next steps
4. Any important notes or warnings

Medical Data:`;

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Analysis endpoint with file upload support
app.post('/api/analyze', upload.array('files'), async (req, res) => {
  try {
    const { medicalData } = req.body;
    let combinedData = medicalData || '';

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      combinedData += '\n\nUploaded Files:\n';
      req.files.forEach(file => {
        combinedData += `\n- ${file.originalname}`;
        if (file.mimetype.startsWith('image/')) {
          combinedData += ` (Image file: ${file.path})`;
        }
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(MEDICAL_PROMPT + "\n\n" + combinedData);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      analysis: text,
      uploadedFiles: req.files ? req.files.map(f => ({ 
        name: f.originalname,
        path: f.path 
      })) : []
    });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to analyze medical data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 