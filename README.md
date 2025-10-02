# AI Interview Assistant

An intelligent, AI-powered interview platform for Full Stack Developer candidates, built with React and powered by Google Gemini AI. This application conducts automated technical interviews, evaluates answers in real-time, and provides comprehensive candidate assessments.

## 🌟 Features

### For Interviewees
- **Resume Upload & Parsing**: Upload PDF or DOCX resumes with automatic extraction of candidate information
- **AI-Powered Questions**: Dynamic question generation based on React.js and Node.js technologies
- **Real-Time Evaluation**: Instant feedback and scoring on answers using Google Gemini AI
- **Timed Questions**: Different time limits based on difficulty levels (Easy: 20s, Medium: 60s, Hard: 120s)
- **Progress Tracking**: Visual progress indicators and interview state management
- **Session Persistence**: Resume interrupted interviews from where you left off

### For Interviewers
- **Candidate Dashboard**: View and manage all interviewed candidates
- **Detailed Reports**: Comprehensive breakdown of candidate performance
- **Search & Filter**: Advanced search and sorting capabilities
- **Performance Metrics**: Category-wise scoring (React.js vs Node.js) and difficulty-level analysis
- **AI-Generated Summaries**: Automated candidate evaluation summaries

## 🚀 Tech Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI API
- **Resume Parsing**: 
  - PDF.js for PDF files
  - Mammoth.js for DOCX files
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-interview-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in with your Google account
- Create a new API key

4. **Start the development server**
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx
│   │   └── Tabs.jsx
│   ├── IntervieweeTab/
│   │   ├── ChatInterface.jsx
│   │   ├── QuestionTimer.jsx
│   │   ├── ResumeUpload.jsx
│   │   └── WelcomeBackModal.jsx
│   └── InterviewerTab/
│       ├── CandidateDetail.jsx
│       ├── CandidateList.jsx
│       └── SearchSort.jsx
├── redux/
│   ├── slices/
│   │   ├── candidateSlice.js
│   │   ├── interviewSlice.js
│   │   └── uiSlice.js
│   ├── middleware/
│   │   └── syncMiddleware.js
│   └── store.js
├── services/
│   ├── aiService.js
│   ├── resumeParser.js
│   └── storageService.js
├── utils/
│   ├── constants.js
│   └── validators.js
├── App.jsx
└── index.js
```

## 🎯 How It Works

### Interview Flow

1. **Resume Upload**: Candidate uploads their resume (PDF/DOCX)
2. **Information Collection**: System extracts name, email, and phone number
3. **Interview Start**: Candidate types "start" to begin the interview
4. **Question Generation**: AI generates 6 questions:
   - 2 Easy (1 React + 1 Node.js)
   - 2 Medium (1 React + 1 Node.js)
   - 2 Hard (1 React + 1 Node.js)
5. **Timed Responses**: Candidate answers within time limits
6. **AI Evaluation**: Each answer is scored and feedback is provided
7. **Final Report**: Comprehensive summary with total score and recommendations

### Scoring System

- **Easy Questions**: 10 points each (20 total)
- **Medium Questions**: 15 points each (30 total)
- **Hard Questions**: 20 points each (40 total)
- **Maximum Score**: 90 points

## 🔑 Key Features Explained

### AI Question Generation
- Uses Google Gemini AI to generate unique, context-specific questions
- Prevents repetition by tracking previously asked questions
- Category-specific topics (React.js vs Node.js)
- Difficulty-appropriate complexity

### Answer Evaluation
- AI-powered scoring based on:
  - Technical accuracy (40%)
  - Completeness (30%)
  - Clarity and communication (20%)
  - Practical understanding (10%)

### State Persistence
- Redux Persist for candidate data
- LocalStorage for session management
- Automatic session recovery for interrupted interviews

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Notifications**: Toast notifications for user feedback
- **Visual Timers**: Color-coded countdown timers
- **Interactive Cards**: Hover effects and smooth transitions

## 📊 Dashboard Features

### Interviewer Dashboard
- View all completed interviews
- Search candidates by name, email, or phone
- Sort by score, date, name, or status
- Click on any candidate for detailed view

### Candidate Detail View
- Complete interview transcript
- Question-by-question breakdown
- AI feedback for each answer
- Technology-wise performance (React vs Node)
- Overall hiring recommendation

## 🔒 Data Storage

- **Candidates**: Persisted in Redux + LocalStorage
- **Active Sessions**: LocalStorage (cleared on completion)
- **No Backend Required**: Fully client-side application

## 🐛 Troubleshooting

### Common Issues

1. **PDF parsing errors**
   - Ensure PDF.js worker is properly loaded
   - Check browser console for worker errors

2. **API Key errors**
   - Verify your Gemini API key is correct
   - Check API key has proper permissions
   - Ensure `.env` file is in root directory

3. **State persistence issues**
   - Clear browser localStorage if needed
   - Check Redux DevTools for state inspection

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Netlify/Vercel

1. Push your code to GitHub
2. Connect repository to Netlify/Vercel
3. Set environment variable: `REACT_APP_GEMINI_API_KEY`
4. Deploy!

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GEMINI_API_KEY` | Google Gemini API Key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## 🙏 Acknowledgments

- Google Gemini AI for powering the interview intelligence
- PDF.js for PDF parsing capabilities
- Mammoth.js for DOCX parsing
- Tailwind CSS for beautiful styling
- Lucide React for icons

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React and Google Gemini AI**
