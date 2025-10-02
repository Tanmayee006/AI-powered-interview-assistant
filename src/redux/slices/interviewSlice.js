import { createSlice } from '@reduxjs/toolkit';
import { INTERVIEW_STATES } from '../../utils/constants';

const initialState = {
  currentCandidate: null,
  interviewState: INTERVIEW_STATES.NOT_STARTED,
  currentQuestion: null,
  questionIndex: 0,
  timer: 0,
  isTimerActive: false,
  messages: [],
  missingFields: [],
  collectingField: null,
  currentAnswer: ''
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentCandidate: (state, action) => {
      state.currentCandidate = action.payload;
    },
    setInterviewState: (state, action) => {
      state.interviewState = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setQuestionIndex: (state, action) => {
      state.questionIndex = action.payload;
    },
    setTimer: (state, action) => {
      state.timer = action.payload;
    },
    setIsTimerActive: (state, action) => {
      state.isTimerActive = action.payload;
    },
    decrementTimer: (state) => {
      if (state.timer > 0) {
        state.timer -= 1;
      }
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMissingFields: (state, action) => {
      state.missingFields = action.payload;
    },
    setCollectingField: (state, action) => {
      state.collectingField = action.payload;
    },
    setCurrentAnswer: (state, action) => {
      state.currentAnswer = action.payload;
    },
    resetInterview: (state) => {
      return initialState;
    },
    updateCurrentCandidateField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentCandidate) {
        state.currentCandidate[field] = value;
      }
    },
    addAnswerToCurrentCandidate: (state, action) => {
      if (state.currentCandidate) {
        if (!state.currentCandidate.answers) {
          state.currentCandidate.answers = [];
        }
        state.currentCandidate.answers.push(action.payload);
      }
    }
  }
});

export const {
  setCurrentCandidate,
  setInterviewState,
  setCurrentQuestion,
  setQuestionIndex,
  setTimer,
  setIsTimerActive,
  decrementTimer,
  addMessage,
  setMessages,
  setMissingFields,
  setCollectingField,
  setCurrentAnswer,
  resetInterview,
  updateCurrentCandidateField,
  addAnswerToCurrentCandidate
} = interviewSlice.actions;

export default interviewSlice.reducer;