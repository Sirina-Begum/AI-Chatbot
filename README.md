# AI Chatbot with Google Drive Excel Integration

A modern AI-powered chatbot that allows customers to enter their User ID and fetch personalized data from Google Drive Excel files, then interact with an AI assistant that has access to their information.

## 🚀 Features

- **User ID Authentication**: Customers enter their User ID to access personalized data
- **Google Drive Integration**: Fetches data from Excel files stored in Google Drive
- **AI-Powered Chat**: OpenAI GPT integration for intelligent responses
- **Real-time Chat**: Socket.IO for instant messaging experience
- **Data Caching**: Efficient caching system for better performance
- **Responsive Design**: Modern, mobile-friendly UI
- **User Data Display**: Sidebar showing fetched user information
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time**: Socket.IO
- **AI**: OpenAI GPT-3.5-turbo
- **Google APIs**: Google Drive API
- **Excel Processing**: XLSX library
- **Styling**: Modern CSS with gradients and animations

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v14 or higher)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)
3. **Google Drive API Credentials** - Set up Google Cloud Project and enable Drive API

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd chatbot

# Install dependencies
npm install
```

### 2. Google Drive API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API
4. Create a Service Account
5. Download the JSON credentials file
6. Rename it to `credentials.json` and place it in the project root

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your actual values:
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key
   GOOGLE_APPLICATION_CREDENTIALS=credentials.json
   PORT=3000
   ```

### 4. Prepare Your Excel File

Create an Excel file with the following structure:
- Must have a column named "USER ID" (or "User ID", "user_id", "userId")
- Include other user data columns as needed
- Upload the file to your Google Drive

### 5. Run the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
chatbot/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # Frontend JavaScript
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables example
├── credentials.json        # Google Drive API credentials (you need to add this)
└── README.md              # This file
```

## 🎯 How It Works

1. **User ID Input**: Customer enters their User ID in the web interface
2. **Data Fetching**: System searches Google Drive for Excel files and fetches user data
3. **Data Display**: User information is displayed in a sidebar
4. **AI Chat**: Customer can chat with AI assistant that has access to their data
5. **Real-time Responses**: Instant AI responses via Socket.IO

## 🔌 API Endpoints

### POST `/api/fetch-user-data`
Fetches user data from Google Drive Excel file
- **Body**: `{ "userId": "string" }`
- **Response**: `{ "success": true, "data": {...}, "source": "google-drive|cache" }`

### POST `/api/chat`
Processes chat messages with AI
- **Body**: `{ "message": "string", "userData": {...} }`
- **Response**: `{ "success": true, "response": "string" }`

## 🎨 Customization

### Styling
- Modify `public/styles.css` to change the appearance
- The design uses CSS custom properties for easy theming

### AI Behavior
- Edit the system prompt in `server.js` to change AI behavior
- Adjust `max_tokens` and `temperature` parameters

### Excel File Structure
- The system looks for columns: "USER ID", "User ID", "user_id", or "userId"
- Add more column variations in the `server.js` file

## 🔒 Security Considerations

- Store API keys in environment variables
- Use HTTPS in production
- Implement rate limiting for production use
- Add authentication if needed
- Validate and sanitize user inputs

## 🚀 Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Upload Google credentials as config vars
4. Deploy using Git

### Vercel/Netlify
- Frontend can be deployed to Vercel/Netlify
- Backend needs to be deployed separately (Railway, Render, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **Google Drive API Error**
   - Ensure credentials.json is properly configured
   - Check if Google Drive API is enabled
   - Verify file permissions

2. **OpenAI API Error**
   - Check if API key is valid
   - Ensure sufficient credits in OpenAI account

3. **Excel File Not Found**
   - Verify Excel file is in Google Drive
   - Check if the file has the correct USER ID column

4. **User Data Not Found**
   - Ensure User ID exists in the Excel file
   - Check column name variations

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a demonstration project. For production use, implement proper security measures, error handling, and scalability features. 