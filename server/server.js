// server.js (CORRECTED)

const express = require('express');
const cors = require('cors');
// --- NOTE: Multer is no longer needed since you are sending JSON with base64 data.
// const multer = require('multer'); 
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Keep the limit high for base64 encoded images
app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---
// NOTE: Since you are now expecting JSON, you do not need 'upload.none()' or 'multer'.
app.post('/api/gemini-proxy', async (req, res) => {
    const { prompt, imageData, mimeType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log('API Key Status:', apiKey ? 'Key Loaded' : 'Key MISSING');
    if (apiKey) {
        console.log('Key Prefix for Verification:', apiKey.substring(0, 8));
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    if (!prompt) {
        return res.status(400).json({ error: 'A text prompt is required.' });
    }

    // Recommended: Use the stable, high-performance multimodal model.
    // 'gemini-2.5-flash' supports both text-only and multimodal (text + image).
    const model = 'gemini-2.5-flash'; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Build the request parts
    const parts = [{ text: prompt }];
    
    // Check if image data is present before adding the image part
    if (imageData && mimeType) {
        parts.push({
            // *** CORRECTION 1: Use inline_data (with underscore) for REST API ***
            inline_data: { 
                // *** CORRECTION 2: Use mime_type (with underscore) for REST API ***
                mime_type: mimeType, 
                data: imageData
            }
        });
    }

    const requestBody = {
        contents: [{ parts }],
        generationConfig: {
            // Keep the JSON response requirement for consistency with your frontend logic
            response_mime_type: "application/json", 
        }
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            console.error('Gemini API Error:', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Request Error:', error.message);
            res.status(500).json({ error: 'Failed to make request to Gemini API.', details: error.message });
        }
    }
});

// --- STATIC FILE SERVING ---
// Serve the built React app
app.use(express.static(path.join(__dirname, '../build')));

// For any request that doesn't match an API route or a static file, 
// send back the main index.html file. This is for client-side routing.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

