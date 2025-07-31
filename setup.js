#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🤖 AI Chatbot Setup Wizard');
console.log('==========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
    console.log('⚠️  .env file already exists. This will overwrite it.\n');
}

// Questions for setup
const questions = [
    {
        name: 'openaiKey',
        question: 'Enter your OpenAI API Key: ',
        required: true
    },
    {
        name: 'port',
        question: 'Enter port number (default: 3000): ',
        required: false,
        default: '3000'
    }
];

let answers = {};

function askQuestion(index) {
    if (index >= questions.length) {
        createEnvFile();
        return;
    }

    const question = questions[index];
    const prompt = question.question;

    rl.question(prompt, (answer) => {
        if (question.required && !answer.trim()) {
            console.log('❌ This field is required. Please try again.\n');
            askQuestion(index);
            return;
        }

        answers[question.name] = answer.trim() || question.default;
        askQuestion(index + 1);
    });
}

function createEnvFile() {
    const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${answers.openaiKey}

# Google Drive API Configuration
GOOGLE_APPLICATION_CREDENTIALS=credentials.json

# Server Configuration
PORT=${answers.port}

# Optional: Database Configuration (if you want to add database support later)
# DATABASE_URL=your_database_url_here

# Optional: JWT Secret (if you want to add authentication later)
# JWT_SECRET=your_jwt_secret_here
`;

    try {
        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ .env file created successfully!');
    } catch (error) {
        console.error('\n❌ Error creating .env file:', error.message);
        rl.close();
        return;
    }

    checkCredentialsFile();
}

function checkCredentialsFile() {
    const credentialsPath = path.join(__dirname, 'credentials.json');
    const credentialsExist = fs.existsSync(credentialsPath);

    if (!credentialsExist) {
        console.log('\n⚠️  Google Drive API credentials file not found.');
        console.log('To set up Google Drive API:');
        console.log('1. Go to https://console.cloud.google.com/');
        console.log('2. Create a new project or select existing one');
        console.log('3. Enable the Google Drive API');
        console.log('4. Create a Service Account');
        console.log('5. Download the JSON credentials file');
        console.log('6. Rename it to "credentials.json" and place it in the project root');
        console.log('\n📖 See README.md for detailed instructions.');
    } else {
        console.log('\n✅ Google Drive API credentials file found!');
    }

    finalInstructions();
}

function finalInstructions() {
    console.log('\n🎉 Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Create an Excel file with user data (see sample-data-structure.md)');
    console.log('3. Upload the Excel file to your Google Drive');
    console.log('4. Start the application: npm run dev');
    console.log('5. Visit http://localhost:' + answers.port);
    console.log('\n📖 For more information, see README.md');
    
    rl.close();
}

// Start the setup process
askQuestion(0); 