import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock } from 'lucide-react';
import { decrementTimer, setIsTimerActive } from '../../redux/slices/interviewSlice';

const QuestionTimer = ({ onTimeUp }) => {
  const dispatch = useDispatch();
  const timer = useSelector(state => state.interview.timer);
  const isTimerActive = useSelector(state => state.interview.isTimerActive);
  const currentQuestion = useSelector(state => state.interview.currentQuestion);

  useEffect(() => {
    let interval;
    
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      dispatch(setIsTimerActive(false));
      if (onTimeUp) onTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isTimerActive, dispatch, onTimeUp]);

  if (!currentQuestion || !isTimerActive) return null;

  const percentage = currentQuestion ? (timer / currentQuestion.maxTime) * 100 : 0;
  const isWarning = timer <= 10;
  const isCritical = timer <= 5;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`${isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-orange-500' : 'text-blue-500'}`} size={24} />
          <span className="font-medium text-gray-700">Time Remaining</span>
        </div>
        <span className={`text-3xl font-bold ${isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-orange-500' : 'text-gray-800'}`}>
          {timer}s
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isWarning && (
        <p className={`text-sm mt-2 text-center font-medium ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
          {isCritical ? '⚠️ Time almost up!' : 'Hurry up!'}
        </p>
      )}
    </div>
  );
};

export default QuestionTimer;