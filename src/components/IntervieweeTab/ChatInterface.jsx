import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, TrendingUp } from 'lucide-react';
import { 
  setCurrentAnswer, 
  addMessage, 
  setQuestionIndex,
  setCurrentQuestion,
  setTimer,
  setIsTimerActive,
  updateCurrentCandidateField,
  addAnswerToCurrentCandidate,
  setInterviewState,
  setCollectingField,
  setMissingFields
} from '../../redux/slices/interviewSlice';
import { addCandidate } from '../../redux/slices/candidateSlice';
import { generateQuestion, scoreAnswer, generateFinalSummary } from '../../services/aiService';
import { clearCurrentSession } from '../../services/storageService';
import { MESSAGE_TYPES, INTERVIEW_STATES, QUESTION_TIMERS, QUESTION_CATEGORIES, DIFFICULTY_COLORS } from '../../utils/constants';
import QuestionTimer from './QuestionTimer';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);
  
  const currentCandidate = useSelector(state => state.interview.currentCandidate);
  const interviewState = useSelector(state => state.interview.interviewState);
  const messages = useSelector(state => state.interview.messages);
  const currentAnswer = useSelector(state => state.interview.currentAnswer);
  const currentQuestion = useSelector(state => state.interview.currentQuestion);
  const questionIndex = useSelector(state => state.interview.questionIndex);
  const collectingField = useSelector(state => state.interview.collectingField);
  const missingFields = useSelector(state => state.interview.missingFields);
  const timer = useSelector(state => state.interview.timer);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentAnswer.trim()) return;

    const userMessage = currentAnswer.trim();
    dispatch(addMessage({
      type: MESSAGE_TYPES.USER,
      content: userMessage,
      timestamp: Date.now()
    }));
    dispatch(setCurrentAnswer(''));

    // Collecting missing fields
    if (collectingField && interviewState === INTERVIEW_STATES.COLLECTING_INFO) {
      dispatch(updateCurrentCandidateField({
        field: collectingField,
        value: userMessage
      }));

      const remaining = missingFields.filter(f => f !== collectingField);
      
      if (remaining.length > 0) {
        dispatch(setCollectingField(remaining[0]));
        dispatch(addMessage({
          type: MESSAGE_TYPES.BOT,
          content: `Got it! Now, what is your ${remaining[0]}?`,
          timestamp: Date.now()
        }));
      } else {
        dispatch(setCollectingField(null));
        dispatch(setMissingFields([]));
        dispatch(setInterviewState(INTERVIEW_STATES.NOT_STARTED));
        dispatch(addMessage({
          type: MESSAGE_TYPES.BOT,
          content: `Perfect! All details collected.\n\n📝 Name: ${currentCandidate.name}\n📧 Email: ${currentCandidate.email}\n📞 Phone: ${currentCandidate.phone}\n\nReady to start your Full Stack Developer interview?`,
          timestamp: Date.now()
        }));
        dispatch(addMessage({
          type: MESSAGE_TYPES.SYSTEM,
          content: '💡 Type "start" to begin the interview.',
          timestamp: Date.now()
        }));
      }
      return;
    }

    // Start interview
    if (interviewState === INTERVIEW_STATES.NOT_STARTED && userMessage.toLowerCase() === 'start') {
      await startInterview();
      return;
    }

    // During interview - submit answer
    if (interviewState === INTERVIEW_STATES.IN_PROGRESS && currentQuestion) {
      await submitAnswer(userMessage);
    }
  };

  const startInterview = async () => {
    dispatch(setInterviewState(INTERVIEW_STATES.IN_PROGRESS));
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: '🚀 Interview started!\n\nYou will be asked 6 questions:\n• 2 Easy (1 React + 1 Node.js)\n• 2 Medium (1 React + 1 Node.js)\n• 2 Hard (1 React + 1 Node.js)\n\nGood luck!',
      timestamp: Date.now()
    }));
    
    await loadNextQuestion();
  };

  // const loadNextQuestion = async () => {
  //   if (questionIndex >= 6) {
  //     await finishInterview();
  //     return;
  //   }

  //   // Get difficulty and category from QUESTION_CATEGORIES
  //   const { difficulty, category } = QUESTION_CATEGORIES[questionIndex];
    
  //   const technologyName = category === 'react' ? 'React.js' : 'Node.js';
    
  //   dispatch(addMessage({
  //     type: MESSAGE_TYPES.SYSTEM,
  //     content: `🤔 Generating your next ${technologyName} question...`,
  //     timestamp: Date.now()
  //   }));

  //   try {
  //     // Get ALL previously asked questions from current candidate
  //     const previousQuestions = currentCandidate.answers?.map(a => a.question) || [];
      
  //     const questionText = await generateQuestion(difficulty, category, previousQuestions);
      
  //     const question = {
  //       text: questionText,
  //       difficulty,
  //       category,
  //       index: questionIndex + 1,
  //       maxTime: QUESTION_TIMERS[difficulty]
  //     };

  //     dispatch(setCurrentQuestion(question));
  //     dispatch(setTimer(QUESTION_TIMERS[difficulty]));
  //     dispatch(setIsTimerActive(true));
      
  //     dispatch(addMessage({
  //       type: MESSAGE_TYPES.BOT,
  //       content: `**Question ${questionIndex + 1}/6** [${difficulty} - ${technologyName}]\n\n${questionText}`,
  //       timestamp: Date.now(),
  //       difficulty
  //     }));
  //     dispatch(addMessage({
  //       type: MESSAGE_TYPES.SYSTEM,
  //       content: `⏰ You have ${QUESTION_TIMERS[difficulty]} seconds to answer. Timer starts now!`,
  //       timestamp: Date.now()
  //     }));
  //   } catch (error) {
  //     console.error('Error loading question:', error);
  //     dispatch(addMessage({
  //       type: MESSAGE_TYPES.SYSTEM,
  //       content: '❌ Error generating question. Please try again.',
  //       timestamp: Date.now()
  //     }));
  //   }
  // };
  const loadNextQuestion = async (index = questionIndex) => {
  if (index >= QUESTION_CATEGORIES.length) {
    await finishInterview();
    return;
  }

  const { difficulty, category } = QUESTION_CATEGORIES[index];
  const technologyName = category === 'react' ? 'React.js' : 'Node.js';

  dispatch(addMessage({
    type: MESSAGE_TYPES.SYSTEM,
    content: `🤔 Generating your next ${technologyName} question...`,
    timestamp: Date.now()
  }));

  try {
    // Collect previously asked questions (avoid duplicates)
    const previousQuestions = currentCandidate.answers?.map(a => a.question) || [];

    // Generate new question text
    const questionText = await generateQuestion(difficulty, category, previousQuestions);

    const question = {
      text: questionText,
      difficulty,
      category,
      index: index + 1, // use passed index
      maxTime: QUESTION_TIMERS[difficulty]
    };

    // Save question in store
    dispatch(setCurrentQuestion(question));
    dispatch(setTimer(QUESTION_TIMERS[difficulty]));
    dispatch(setIsTimerActive(true));

    // Bot message with question
    dispatch(addMessage({
      type: MESSAGE_TYPES.BOT,
      content: `**Question ${index + 1}/6** [${difficulty} - ${technologyName}]\n\n${questionText}`,
      timestamp: Date.now(),
      difficulty
    }));

    // System message with timer info
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: `⏰ You have ${QUESTION_TIMERS[difficulty]} seconds to answer. Timer starts now!`,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error loading question:', error);
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: '❌ Error generating question. Please try again.',
      timestamp: Date.now()
    }));
  }
};


  const submitAnswer = async (answer) => {
    dispatch(setIsTimerActive(false));
     const timeTaken = QUESTION_TIMERS[currentQuestion.difficulty] - timer;
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: '⏳ Evaluating your answer... Please wait.',
      timestamp: Date.now()
    }));

    try {
      const { score, feedback } = await scoreAnswer(
        currentQuestion.text,
        answer,
        currentQuestion.difficulty
      );

      const answerData = {
        question: currentQuestion.text,
        answer,
        difficulty: currentQuestion.difficulty,
        category: currentQuestion.category,
        score,
        feedback,
        timeTaken,
        timestamp: Date.now()
      };

      dispatch(addAnswerToCurrentCandidate(answerData));

      const maxScore = currentQuestion.difficulty === 'Easy' ? 10 : currentQuestion.difficulty === 'Medium' ? 15 : 20;
      const percentage = Math.round((score / maxScore) * 100);
      
      dispatch(addMessage({
        type: MESSAGE_TYPES.SYSTEM,
        content: `✅ Score: ${score}/${maxScore} (${percentage}%)\n\n💬 ${feedback}`,
        timestamp: Date.now()
      }));

      const nextIndex = questionIndex + 1;
      dispatch(setQuestionIndex(nextIndex));
      dispatch(setCurrentQuestion(null));

      setTimeout(() => {
        loadNextQuestion(nextIndex); // 👈 pass it in directly
      }, 2000);
    } catch (error) {
      console.error('Error scoring answer:', error);
      dispatch(addMessage({
        type: MESSAGE_TYPES.SYSTEM,
        content: '❌ Error evaluating answer. Moving to next question.',
        timestamp: Date.now()
      }));
      dispatch(setQuestionIndex(questionIndex + 1));
      dispatch(setCurrentQuestion(null));
      setTimeout(() => loadNextQuestion(), 2000);
    }
  };

  const handleTimeUp = () => {
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: '⏰ Time\'s up! Submitting your answer...',
      timestamp: Date.now()
    }));
    
    const answer = currentAnswer.trim() || 'No answer provided (time expired)';
    submitAnswer(answer);
    dispatch(setCurrentAnswer(''));
  };

  const finishInterview = async () => {
    dispatch(setInterviewState(INTERVIEW_STATES.COMPLETED));
    dispatch(setIsTimerActive(false));
    
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: '⏳ Generating your final report... Please wait.',
      timestamp: Date.now()
    }));

    try {
      const totalScore = currentCandidate.answers.reduce((sum, a) => sum + a.score, 0);
      const summary = await generateFinalSummary(currentCandidate);
      
      const completedCandidate = {
        ...currentCandidate,
        totalScore,
        summary,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        messages
      };

      dispatch(addCandidate(completedCandidate));
      
      dispatch(addMessage({
        type: MESSAGE_TYPES.SYSTEM,
        content: '🎉 Interview completed successfully!',
        timestamp: Date.now()
      }));
      
      const reactScore = currentCandidate.answers.filter(a => a.category === 'react').reduce((sum, a) => sum + a.score, 0);
      const nodeScore = currentCandidate.answers.filter(a => a.category === 'node').reduce((sum, a) => sum + a.score, 0);
      
      dispatch(addMessage({
        type: MESSAGE_TYPES.BOT,
        content: `**Final Results**\n\n📊 Total Score: ${totalScore}/90\n\n**Category Breakdown:**\n• React.js: ${reactScore}/45\n• Node.js: ${nodeScore}/45\n\n📝 **Summary:**\n${summary}\n\nThank you for completing the interview! You can now check the Interviewer Dashboard to see your detailed results.`,
        timestamp: Date.now()
      }));

      clearCurrentSession();
    } catch (error) {
      console.error('Error finishing interview:', error);
      dispatch(addMessage({
        type: MESSAGE_TYPES.SYSTEM,
        content: '❌ Error generating final report.',
        timestamp: Date.now()
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentCandidate) return null;

  const isInterviewActive = interviewState === INTERVIEW_STATES.IN_PROGRESS || 
                           interviewState === INTERVIEW_STATES.COLLECTING_INFO ||
                           interviewState === INTERVIEW_STATES.NOT_STARTED;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: '700px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">{currentCandidate.name || 'Candidate'}</h3>
            <p className="text-sm text-blue-100">
              {interviewState === INTERVIEW_STATES.COMPLETED 
                ? '✅ Interview Completed' 
                : interviewState === INTERVIEW_STATES.COLLECTING_INFO
                ? '📝 Collecting Information'
                : interviewState === INTERVIEW_STATES.IN_PROGRESS
                ? `📊 Question ${questionIndex}/6 ${currentQuestion ? `(${currentQuestion.category === 'react' ? 'React' : 'Node.js'})` : ''}`
                : '🚀 Ready to Start'}
            </p>
          </div>
          {interviewState === INTERVIEW_STATES.IN_PROGRESS && (
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <TrendingUp size={20} />
              <span className="font-bold">Progress: {Math.round((questionIndex / 6)* 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      {currentQuestion && interviewState === INTERVIEW_STATES.IN_PROGRESS && (
        <div className="px-6 pt-4">
          <QuestionTimer onTimeUp={handleTimeUp} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === MESSAGE_TYPES.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-lg whitespace-pre-wrap ${
                msg.type === MESSAGE_TYPES.USER
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.type === MESSAGE_TYPES.BOT
                  ? msg.difficulty 
                    ? `${DIFFICULTY_COLORS[msg.difficulty].bg} ${DIFFICULTY_COLORS[msg.difficulty].text} border ${DIFFICULTY_COLORS[msg.difficulty].border} rounded-bl-none`
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  : 'bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      {interviewState !== INTERVIEW_STATES.COMPLETED && (
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex gap-3">
            <textarea
              value={currentAnswer}
              onChange={(e) => dispatch(setCurrentAnswer(e.target.value))}
              onKeyPress={handleKeyPress}
              placeholder={
                interviewState === INTERVIEW_STATES.IN_PROGRESS
                  ? "Type your answer here..."
                  : interviewState === INTERVIEW_STATES.COLLECTING_INFO
                  ? `Enter your ${collectingField}...`
                  : 'Type "start" to begin the interview...'
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={!isInterviewActive}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentAnswer.trim() || !isInterviewActive}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <Send size={20} />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;