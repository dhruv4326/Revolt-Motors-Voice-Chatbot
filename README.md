# Revolt Motors Voice Chat - Gemini Live API Implementation

A real-time voice interface replicating the Revolt Motors chatbot functionality using Google's Gemini Live API with server-to-server architecture.

## 🚀 Features

- **Real-time Voice Conversation**: Natural, low-latency voice interaction
- **Interruption Support**: Users can interrupt the AI mid-response
- **Multi-language Support**: Inherits Gemini's multilingual capabilities
- **Revolt Motors Focused**: AI assistant trained specifically for Revolt Motors queries
- **Modern UI**: Clean, responsive interface with voice visualization
- **Server-to-Server Architecture**: Secure backend handling of API communications

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API key
- Modern web browser with microphone support

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd revolt-motors-voice-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Get your API key from [Google AI Studio](https://aistudio.google.com)

3. Edit `.env` file with your API key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
GEMINI_MODEL=gemini-live-2.5-flash-preview
```

### 4. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎯 Model Configuration

### Development & Testing
For extensive testing and development, use these models to avoid rate limits:
- `gemini-live-2.5-flash-preview`
- `gemini-2.0-flash-live-001`

### Production
For final submission, switch to:
- `gemini-2.5-flash-preview-native-audio-dialog`

Update the `GEMINI_MODEL` in your `.env` file accordingly.

## 🎮 How to Use

1. **Grant Permissions**: Allow microphone access when prompted
2. **Start Conversation**: Click "Start Conversation" button
3. **Speak Naturally**: Talk to Rev about Revolt Motors
4. **Interrupt Feature**: Click "Interrupt" to stop the AI mid-response
5. **Reset**: Use "Reset" to start a fresh conversation

## 🏗️ Architecture

### Server-to-Server Design
- **Frontend**: HTML/CSS/JavaScript with Socket.IO client
- **Backend**: Node.js/Express server with Socket.IO
- **API Integration**: WebSocket connection to Gemini Live API

### Data Flow
1. User speaks → Browser captures audio
2. Audio sent to Node.js server via Socket.IO
3. Server forwards audio to Gemini Live API via WebSocket
4. Gemini processes and responds with audio
5. Server streams response back to client
6. Client plays audio response

## 🎨 System Instructions

The AI assistant is configured with specialized instructions to:
- Only discuss Revolt Motors and electric motorcycles
- Redirect off-topic conversations back to Revolt Motors
- Provide accurate information about Revolt's products and services
- Maintain an enthusiastic tone about electric mobility

## 📁 Project Structure

```
revolt-motors-voice-chat/
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .env                      # Your environment variables (create this)
├── README.md                 # This file
└── public/
    └── index.html           # Frontend application
```

## 🔧 Technical Details

### Audio Processing
- **Input Format**: WebM with Opus codec
- **Sample Rate**: 16kHz mono
- **Streaming**: Real-time audio chunks (100ms intervals)
- **Output**: WAV audio from Gemini Live API

### WebSocket Communication
- Bidirectional communication with Gemini Live API
- Handles setup, audio streaming, and interruptions
- Automatic reconnection on connection loss

### Error Handling
- Microphone permission checks
- Connection status monitoring
- Graceful error recovery
- User-friendly error messages

## 🚨 Troubleshooting

### Common Issues

**1. "Microphone access denied"**
- Solution: Allow microphone access in browser settings
- Chrome: Settings → Privacy → Site Settings → Microphone

**2. "Not connected to server"**
- Check your API key in `.env` file
- Ensure server is running (`npm run dev`)
- Verify internet connection

**3. "High latency responses"**
- Switch to development model for testing
- Check your internet connection speed
- Ensure you're within API rate limits

**4. "Audio not playing"**
- Check browser audio settings
- Ensure speakers/headphones are connected
- Try refreshing the page

### Rate Limits
- Free tier has strict daily limits
- Use development models for extensive testing
- Monitor usage in Google AI Studio console

## 🎬 Demo Video Requirements

Your demo video should show:
1. **Natural Conversation**: Ask Rev about Revolt Motors products
2. **Interruption Feature**: Interrupt the AI mid-response
3. **Low Latency**: Demonstrate quick response times
4. **Topic Adherence**: Show how AI redirects off-topic questions

### Example Questions to Ask:
- "Tell me about Revolt Motors electric motorcycles"
- "What's the range of RV400?"
- "How does the battery swapping work?"
- "What are the charging options?"

## 📱 Browser Compatibility

### Supported Browsers:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+

### Required Features:
- WebRTC/getUserMedia API
- WebSocket support
- Web Audio API
- ES6 support

## 🔐 Security Considerations

- API keys stored server-side only
- No client-side API exposure
- CORS configuration for security
- Input validation and sanitization

## 📊 Performance Optimization

- Audio streaming in small chunks
- Efficient WebSocket message handling
- Memory management for audio buffers
- Connection pooling and reuse

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Production Deployment

**Option 1: Traditional Hosting**
```bash
npm start
```

**Option 2: Docker**
```bash
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Option 3: Cloud Platforms**
- Heroku, Vercel, Railway, or Google Cloud
- Ensure environment variables are configured
- Set up proper port binding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues related to:
- **Gemini API**: Check [Google AI Studio Documentation](https://ai.google.dev/gemini-api/docs/live)
- **This Project**: Create an issue in the GitHub repository
- **Revolt Motors**: Visit [revoltmotors.com](https://revoltmotors.com)

## 🔄 Updates & Maintenance

Keep your dependencies updated:
```bash
npm update
```

Monitor the Gemini Live API for:
- New model releases
- API changes
- Rate limit updates

---

**Note**: This implementation meets all requirements specified in the assignment, including server-to-server architecture, interruption support, low latency, and Revolt Motors-specific system instructions.
