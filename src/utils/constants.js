export const QUESTION_TIMERS = {
  Easy: 20,
  Medium: 60,
  Hard: 120
};

export const DIFFICULTIES = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Hard'];

export const QUESTION_CATEGORIES = [
  { difficulty: 'Easy', category: 'react' },
  { difficulty: 'Easy', category: 'node' },
  { difficulty: 'Medium', category: 'react' },
  { difficulty: 'Medium', category: 'node' },
  { difficulty: 'Hard', category: 'react' },
  { difficulty: 'Hard', category: 'node' }
];

export const INTERVIEW_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  COLLECTING_INFO: 'COLLECTING_INFO',
  IN_PROGRESS: 'IN_PROGRESS',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED'
};

export const MESSAGE_TYPES = {
  SYSTEM: 'system',
  BOT: 'bot',
  USER: 'user'
};

export const CANDIDATE_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED'
};

export const DIFFICULTY_COLORS = {
  Easy: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  Medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  Hard: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  }
};

export const MAX_SCORES = {
  Easy: 10,
  Medium: 15,
  Hard: 20
};

// Replace with your actual Gemini API key
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;