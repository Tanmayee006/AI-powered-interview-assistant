import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { setShowWelcomeBackModal } from '../../redux/slices/uiSlice';
import { resetInterview, setInterviewState } from '../../redux/slices/interviewSlice';
import { clearCurrentSession } from '../../services/storageService';
import { INTERVIEW_STATES } from '../../utils/constants';

const WelcomeBackModal = () => {
  const dispatch = useDispatch();
  const showModal = useSelector(state => state.ui.showWelcomeBackModal);
  const currentCandidate = useSelector(state => state.interview.currentCandidate);
  const questionIndex = useSelector(state => state.interview.questionIndex);

  if (!showModal) return null;

  const handleContinue = () => {
    dispatch(setShowWelcomeBackModal(false));
    dispatch(setInterviewState(INTERVIEW_STATES.IN_PROGRESS));
  };

  const handleStartFresh = () => {
    clearCurrentSession();
    dispatch(resetInterview());
    dispatch(setShowWelcomeBackModal(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <AlertCircle className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-600">
            You have an unfinished interview session.
          </p>
          {currentCandidate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Candidate:</p>
              <p className="font-semibold text-gray-800">{currentCandidate.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                Progress: Question {questionIndex} of 6
              </p>
            </div>
          )}
          <p className="text-gray-600">
            Would you like to continue where you left off or start fresh?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleContinue}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Continue Interview
          </button>
          <button
            onClick={handleStartFresh}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;