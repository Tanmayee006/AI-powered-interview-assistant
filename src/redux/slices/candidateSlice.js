import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  selectedCandidate: null
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
    deleteCandidate: (state, action) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
    }
  }
});

export const {
  addCandidate,
  updateCandidate,
  setSelectedCandidate,
  setCandidates,
  deleteCandidate
} = candidateSlice.actions;

export default candidateSlice.reducer;