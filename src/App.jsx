import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/common/Layout';
import Tabs from './components/common/Tabs';
import WelcomeBackModal from './components/IntervieweeTab/WelcomeBackModal';
import ResumeUpload from './components/IntervieweeTab/ResumeUpload';
import ChatInterface from './components/IntervieweeTab/ChatInterface';
import SearchSort from './components/InterviewerTab/SearchSort';
import CandidateList from './components/InterviewerTab/CandidateList';
import CandidateDetail from './components/InterviewerTab/CandidateDetail';
import { 
  setCurrentCandidate,
  setInterviewState,
  setQuestionIndex,
  setMessages,
  setTimer
} from './redux/slices/interviewSlice';
import { setShowWelcomeBackModal, clearNotification } from './redux/slices/uiSlice';
import { setCandidates } from './redux/slices/candidateSlice';
import { loadCandidates, loadCurrentSession, loadInterviewState } from './services/storageService';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.ui.activeTab);
  const currentCandidate = useSelector(state => state.interview.currentCandidate);
  const selectedCandidate = useSelector(state => state.candidate.selectedCandidate);
  const notification = useSelector(state => state.ui.notification);

  // Load persisted data on mount
  useEffect(() => {
    // Load candidates
    const savedCandidates = loadCandidates();
    if (savedCandidates && savedCandidates.length > 0) {
      dispatch(setCandidates(savedCandidates));
    }

    // Load current session
    const savedSession = loadCurrentSession();
    const savedState = loadInterviewState();

    if (savedSession && savedState && savedState !== 'COMPLETED') {
      dispatch(setCurrentCandidate(savedSession.currentCandidate));
      dispatch(setInterviewState(savedSession.interviewState));
      dispatch(setQuestionIndex(savedSession.questionIndex || 0));
      dispatch(setTimer(savedSession.timer || 0));
      dispatch(setMessages(savedSession.messages || []));
      dispatch(setShowWelcomeBackModal(true));
    }
  }, [dispatch]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {notification.type === 'success' && <CheckCircle size={24} />}
            {notification.type === 'error' && <XCircle size={24} />}
            {notification.type === 'info' && <AlertCircle size={24} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Welcome Back Modal */}
      <WelcomeBackModal />

      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Interview Assistant
              </h1>
              <p className="text-sm text-gray-600">Powered by Google Gemini AI</p>
            </div>
          </div>
        </div>
      </div>

      <Layout>
        <Tabs />

        {/* Interviewee Tab */}
        {activeTab === 'interviewee' && (
          <div>
            {!currentCandidate ? (
              <ResumeUpload />
            ) : (
              <ChatInterface />
            )}
          </div>
        )}

        {/* Interviewer Tab */}
        {activeTab === 'interviewer' && (
          <div>
            {!selectedCandidate ? (
              <>
                <SearchSort />
                <CandidateList />
              </>
            ) : (
              <CandidateDetail />
            )}
          </div>
        )}
      </Layout>
    </div>
  );
}

export default App;