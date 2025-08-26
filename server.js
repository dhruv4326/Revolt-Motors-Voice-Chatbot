const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gemini Regular API handler (fallback solution)
class GeminiHandler {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-001';
    this.systemInstructions = `You are Rev, the AI assistant for Revolt Motors, India's leading electric motorcycle company. 

IMPORTANT GUIDELINES:
- Only discuss topics related to Revolt Motors, electric motorcycles, and sustainable transportation
- If asked about unrelated topics, politely redirect the conversation back to Revolt Motors
- Be enthusiastic about electric vehicles and sustainability
- Provide helpful information about Revolt Motors' products, services, and electric mobility
- Keep responses concise and conversational (2-3 sentences max)

ABOUT REVOLT MOTORS:
- Leading electric motorcycle manufacturer in India
- Founded to accelerate India's transition to sustainable mobility
- Offers smart, connected electric motorcycles
- Key models include RV400 and RV1+ series
- Features include removable batteries, mobile app connectivity, artificial exhaust sounds
- Focus on performance, range, and smart technology
- Committed to building charging infrastructure across India
- Offers subscription plans and flexible ownership models

Keep responses conversational, helpful, and focused on Revolt Motors. If someone asks about competitors or unrelated topics, politely redirect: "I'd love to help you learn more about Revolt Motors and our electric motorcycles instead!"`;
    this.conversationHistory = [];
  }

  async generateResponse(userMessage) {
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.error('❌ GEMINI_API_KEY not set properly in .env file');
      throw new Error('API key not configured');
    }

    try {
      console.log('📤 Sending request to Gemini API...');
      console.log('User message:', userMessage);
      
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Keep only last 10 messages to avoid token limits
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: this.systemInstructions }]
          },
          ...this.conversationHistory
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200, // Keep responses concise
        }
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Gemini API error:', response.status, response.statusText);
        console.error('Error details:', errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const assistantResponse = data.candidates[0].content.parts[0].text;
        console.log('📥 Gemini response:', assistantResponse);
        
        // Add assistant response to conversation history
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: assistantResponse }]
        });

        return assistantResponse;
      } else {
        console.error('❌ Unexpected response format:', data);
        throw new Error('Invalid response format from API');
      }

    } catch (error) {
      console.error('❌ Error generating response:', error);
      throw error;
    }
  }

  resetConversation() {
    this.conversationHistory = [];
    console.log('🔄 Conversation history reset');
  }
}


// Initialize Gemini handler
const geminiHandler = new GeminiHandler();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('text-message', async (textMessage) => {
    try {
      console.log('📝 Received text message:', textMessage);
      const response = await geminiHandler.generateResponse(textMessage);
      socket.emit('text-response', response);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      socket.emit('error', 'Failed to generate response');
    }
  });

  socket.on('reset-conversation', () => {
    geminiHandler.resetConversation();
    socket.emit('conversation-reset');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    apiConfigured: !!(geminiHandler.apiKey && geminiHandler.apiKey !== 'your_api_key_here'),
    model: geminiHandler.model,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Gemini model: ${geminiHandler.model}`);
  if (!geminiHandler.apiKey || geminiHandler.apiKey === 'your_api_key_here') {
    console.log(`❌ Make sure to set your GEMINI_API_KEY in .env file`);
  } else {
    console.log(`✅ API key configured`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close();
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close();
});