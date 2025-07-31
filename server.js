const express = require('express');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');
const XLSX = require('xlsx');
const OpenAI = require('openai');
const http = require('http');
const socketIo = require('socket.io');
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
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// Test data for when Google Drive API is not available
const testUserData = {
  'U001': {
    'USER ID': 'U001',
    'Name': 'John Doe',
    'Email': 'john.doe@company.com',
    'Phone': '+1-555-0123',
    'Department': 'Engineering',
    'Status': 'Active',
    'Join Date': '2023-01-15',
    'Salary': '75000',
    'Manager': 'Sarah Wilson',
    'Project': 'Project Alpha',
    'Skills': 'JavaScript, React, Node.js',
    'Performance Rating': '4.5/5'
  },
  'U002': {
    'USER ID': 'U002',
    'Name': 'Jane Smith',
    'Email': 'jane.smith@company.com',
    'Phone': '+1-555-0124',
    'Department': 'Marketing',
    'Status': 'Active',
    'Join Date': '2023-02-20',
    'Salary': '65000',
    'Manager': 'Mike Davis',
    'Project': 'Project Beta',
    'Skills': 'SEO, Content Marketing, Analytics',
    'Performance Rating': '4.2/5'
  },
  'U003': {
    'USER ID': 'U003',
    'Name': 'Bob Johnson',
    'Email': 'bob.johnson@company.com',
    'Phone': '+1-555-0125',
    'Department': 'Sales',
    'Status': 'Inactive',
    'Join Date': '2023-03-10',
    'Salary': '70000',
    'Manager': 'Lisa Chen',
    'Project': 'Project Gamma',
    'Skills': 'Sales, CRM, Negotiation',
    'Performance Rating': '3.8/5'
  },
  'U004': {
    'USER ID': 'U004',
    'Name': 'Alice Brown',
    'Email': 'alice.brown@company.com',
    'Phone': '+1-555-0126',
    'Department': 'HR',
    'Status': 'Active',
    'Join Date': '2023-04-05',
    'Salary': '60000',
    'Manager': 'Tom Wilson',
    'Project': 'Project Delta',
    'Skills': 'HR Management, Recruitment, Training',
    'Performance Rating': '4.0/5'
  },
  'U005': {
    'USER ID': 'U005',
    'Name': 'Charlie Wilson',
    'Email': 'charlie.wilson@company.com',
    'Phone': '+1-555-0127',
    'Department': 'Engineering',
    'Status': 'Active',
    'Join Date': '2023-05-12',
    'Salary': '80000',
    'Manager': 'Sarah Wilson',
    'Project': 'Project Alpha',
    'Skills': 'Python, Django, AWS',
    'Performance Rating': '4.7/5'
  },
  'U006': {
    'USER ID': 'U006',
    'Name': 'Emma Davis',
    'Email': 'emma.davis@company.com',
    'Phone': '+1-555-0128',
    'Department': 'Marketing',
    'Status': 'Active',
    'Join Date': '2023-06-01',
    'Salary': '68000',
    'Manager': 'Mike Davis',
    'Project': 'Project Beta',
    'Skills': 'Social Media, Branding, Design',
    'Performance Rating': '4.3/5'
  },
  'U007': {
    'USER ID': 'U007',
    'Name': 'David Lee',
    'Email': 'david.lee@company.com',
    'Phone': '+1-555-0129',
    'Department': 'Sales',
    'Status': 'Active',
    'Join Date': '2023-07-15',
    'Salary': '72000',
    'Manager': 'Lisa Chen',
    'Project': 'Project Gamma',
    'Skills': 'B2B Sales, Account Management',
    'Performance Rating': '4.1/5'
  },
  'U008': {
    'USER ID': 'U008',
    'Name': 'Sophia Garcia',
    'Email': 'sophia.garcia@company.com',
    'Phone': '+1-555-0130',
    'Department': 'Engineering',
    'Status': 'Active',
    'Join Date': '2023-08-20',
    'Salary': '78000',
    'Manager': 'Sarah Wilson',
    'Project': 'Project Alpha',
    'Skills': 'Mobile Development, iOS, Android',
    'Performance Rating': '4.6/5'
  }
};

// Google Drive API setup (with error handling)
let drive = null;
let googleDriveAvailable = false;

// Check if credentials.json exists
const fs = require('fs');
const credentialsPath = path.join(__dirname, 'credentials.json');

if (fs.existsSync(credentialsPath)) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    drive = google.drive({ version: 'v3', auth });
    googleDriveAvailable = true;
    console.log('✅ Google Drive API initialized successfully');
  } catch (error) {
    console.log('⚠️  Google Drive API not available - using test data');
    console.log('   Error:', error.message);
  }
} else {
  console.log('⚠️  credentials.json not found - using test data');
  console.log('   To enable Google Drive:');
  console.log('   1. Go to https://console.cloud.google.com/');
  console.log('   2. Create a project and enable Google Drive API');
  console.log('   3. Create a Service Account and download credentials.json');
  console.log('   4. Place credentials.json in the project root');
  console.log('   5. Restart the server');
}

// Store user data cache
const userDataCache = new Map();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to fetch user data from Google Drive Excel
app.post('/api/fetch-user-data', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check cache first
    if (userDataCache.has(userId)) {
      return res.json({ 
        success: true, 
        data: userDataCache.get(userId),
        source: 'cache'
      });
    }

    // If Google Drive is not available, use test data
    if (!googleDriveAvailable) {
      const testData = testUserData[userId];
      if (testData) {
        userDataCache.set(userId, testData);
        return res.json({ 
          success: true, 
          data: testData,
          source: 'test-data',
          message: 'Using test data. Set up Google Drive API for production use.'
        });
      } else {
        return res.status(404).json({ 
          error: 'User data not found. Available test IDs: U001, U002, U003, U004, U005, U006, U007, U008' 
        });
      }
    }

    // Search for Excel files in Google Drive
    const response = await drive.files.list({
      q: "mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'",
      fields: 'files(id, name)',
      pageSize: 10
    });

    if (!response.data.files || response.data.files.length === 0) {
      return res.status(404).json({ error: 'No Excel files found in Google Drive' });
    }

    // Get the first Excel file (you can modify this logic to search for specific files)
    const excelFile = response.data.files[0];
    
    // Download the Excel file
    const fileResponse = await drive.files.get({
      fileId: excelFile.id,
      alt: 'media'
    }, { responseType: 'arraybuffer' });

    // Parse Excel data
    const workbook = XLSX.read(fileResponse.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Find user data by USER ID
    const userData = data.find(row => {
      const rowUserId = row['USER ID'] || row['User ID'] || row['user_id'] || row['userId'];
      return rowUserId && rowUserId.toString() === userId.toString();
    });

    if (!userData) {
      return res.status(404).json({ error: 'User data not found for the provided USER ID' });
    }

    // Cache the user data
    userDataCache.set(userId, userData);

    res.json({ 
      success: true, 
      data: userData,
      source: 'google-drive'
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // If Google Drive fails, try test data as fallback
    if (!googleDriveAvailable) {
      const testData = testUserData[userId];
      if (testData) {
        userDataCache.set(userId, testData);
        return res.json({ 
          success: true, 
          data: testData,
          source: 'test-data-fallback',
          message: 'Google Drive unavailable. Using test data.'
        });
      }
    }
    
    // If Google Drive is available but fails, try test data
    if (googleDriveAvailable) {
      const testData = testUserData[userId];
      if (testData) {
        userDataCache.set(userId, testData);
        return res.json({ 
          success: true, 
          data: testData,
          source: 'test-data-fallback',
          message: 'Google Drive error. Using test data as fallback.'
        });
      }
    }
    
    // If no test data available, return error
    res.status(500).json({ 
      error: 'Failed to fetch user data. Please try again or contact support.',
      details: error.message 
    });
  }
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userData } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create context with user data
    const context = userData ? 
      `User Data: ${JSON.stringify(userData)}\n\nUser Question: ${message}` :
      `User Question: ${message}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for a customer service chatbot. 
          You have access to user data from an Excel file. 
          Please provide helpful, accurate, and friendly responses based on the user's data and questions.
          If the user asks about their data, use the provided user data to give specific answers.
          Keep responses concise and professional.`
        },
        {
          role: "user",
          content: context
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined chat room`);
  });

  socket.on('send-message', async (data) => {
    try {
      const { message, userId, userData } = data;
      
      // Process with AI
      const context = userData ? 
        `User Data: ${JSON.stringify(userData)}\n\nUser Question: ${message}` :
        `User Question: ${message}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a customer service chatbot. 
            You have access to user data from an Excel file. 
            Please provide helpful, accurate, and friendly responses based on the user's data and questions.
            If the user asks about their data, use the provided user data to give specific answers.
            Keep responses concise and professional.`
          },
          {
            role: "user",
            content: context
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const aiResponse = completion.choices[0].message.content;

      // Emit response back to the user
      socket.emit('ai-response', {
        message: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Socket chat error:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AI Chatbot server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
}); 