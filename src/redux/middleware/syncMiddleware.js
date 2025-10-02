import { saveCandidates, saveCurrentSession, saveInterviewState } from '../../services/storageService';

const syncMiddleware = store => next => action => {
  const result = next(action);
  
  // Save to localStorage after certain actions
  const state = store.getState();
  
  // Save candidates whenever they change
  if (action.type.startsWith('candidate/')) {
    saveCandidates(state.candidate.candidates);
  }
  
  // Save current interview session
  if (action.type.startsWith('interview/')) {
    const { currentCandidate, interviewState, questionIndex, timer, messages } = state.interview;
    
    if (currentCandidate && interviewState !== 'COMPLETED') {
      saveCurrentSession({
        currentCandidate,
        interviewState,
        questionIndex,
        timer,
        messages
      });
      saveInterviewState(interviewState);
    }
  }
  
  return result;
};

export default syncMiddleware;