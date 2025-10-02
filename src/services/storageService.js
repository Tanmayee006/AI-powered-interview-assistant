const STORAGE_KEYS = {
  CANDIDATES: 'interview_candidates',
  CURRENT_SESSION: 'interview_current_session',
  INTERVIEW_STATE: 'interview_state'
};

export const saveCandidates = (candidates) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    return true;
  } catch (error) {
    console.error('Error saving candidates:', error);
    return false;
  }
};

export const loadCandidates = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading candidates:', error);
    return [];
  }
};

export const saveCurrentSession = (sessionData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

export const loadCurrentSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

export const clearCurrentSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEW_STATE);
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

export const saveInterviewState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_STATE, state);
    return true;
  } catch (error) {
    console.error('Error saving interview state:', error);
    return false;
  }
};

export const loadInterviewState = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.INTERVIEW_STATE);
  } catch (error) {
    console.error('Error loading interview state:', error);
    return null;
  }
};