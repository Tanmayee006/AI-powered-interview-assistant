// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ArrowLeft, User, Mail, Phone, Calendar, TrendingUp, Clock, CheckCircle, FileText, Award } from 'lucide-react';
// import { setSelectedCandidate } from '../../redux/slices/candidateSlice';
// import { format } from 'date-fns';
// import { DIFFICULTY_COLORS, MAX_SCORES } from '../../utils/constants';

// const CandidateDetail = () => {
//   const dispatch = useDispatch();
//   const selectedCandidate = useSelector(state => state.candidate.selectedCandidate);

//   if (!selectedCandidate) return null;

//   const getScorePercentage = (score, difficulty) => {
//     const maxScore = MAX_SCORES[difficulty];
//     return Math.round((score / maxScore) * 100);
//   };

//   const getScoreColor = (percentage) => {
//     if (percentage >= 80) return 'text-green-600';
//     if (percentage >= 60) return 'text-blue-600';
//     if (percentage >= 40) return 'text-orange-600';
//     return 'text-red-600';
//   };

//   const overallPercentage = Math.round((selectedCandidate.totalScore / 90) * 100);

//   return (
//     <div>
//       {/* Back Button */}
//       <button
//         onClick={() => dispatch(setSelectedCandidate(null))}
//         className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
//       >
//         <ArrowLeft size={20} />
//         Back to Candidates List
//       </button>

//       {/* Header Card */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-6 shadow-xl">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//           <div className="flex items-start gap-4">
//             <div className="bg-white bg-opacity-20 p-4 rounded-full">
//               <User size={32} />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-3">{selectedCandidate.name}</h2>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <Mail size={16} />
//                   {selectedCandidate.email}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone size={16} />
//                   {selectedCandidate.phone}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar size={16} />
//                   Interviewed on {format(new Date(selectedCandidate.createdAt), 'MMMM dd, yyyy')}
//                 </div>
//                 {selectedCandidate.resumeFile && (
//                   <div className="flex items-center gap-2">
//                     <FileText size={16} />
//                     {selectedCandidate.resumeFile}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm min-w-[200px]">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Award size={24} />
//               <span className="text-sm font-medium">FINAL SCORE</span>
//             </div>
//             <div className="text-5xl font-bold text-center">
//               {selectedCandidate.totalScore || 0}
//             </div>
//             <div className="text-center text-sm mt-2">
//               out of 90 points ({overallPercentage}%)
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Summary Section */}
//       {selectedCandidate.summary && (
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <TrendingUp className="text-blue-600" size={24} />
//             AI Summary
//           </h3>
//           <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//             {selectedCandidate.summary}
//           </p>
//         </div>
//       )}

//       {/* Performance Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
//           <div className="text-sm text-green-700 font-medium mb-2">Easy Questions</div>
//           <div className="text-3xl font-bold text-green-600 mb-1">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Easy').reduce((sum, a) => sum + a.score, 0) || 0}/20
//           </div>
//           <div className="text-xs text-green-600">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Easy').length || 0} questions
//           </div>
//         </div>

//         <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
//           <div className="text-sm text-yellow-700 font-medium mb-2">Medium Questions</div>
//           <div className="text-3xl font-bold text-yellow-600 mb-1">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Medium').reduce((sum, a) => sum + a.score, 0) || 0}/30
//           </div>
//           <div className="text-xs text-yellow-600">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Medium').length || 0} questions
//           </div>
//         </div>

//         <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
//           <div className="text-sm text-red-700 font-medium mb-2">Hard Questions</div>
//           <div className="text-3xl font-bold text-red-600 mb-1">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Hard').reduce((sum, a) => sum + a.score, 0) || 0}/40
//           </div>
//           <div className="text-xs text-red-600">
//             {selectedCandidate.answers?.filter(a => a.difficulty === 'Hard').length || 0} questions
//           </div>
//         </div>
//       </div>

//       {/* Question-by-Question Breakdown */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//           <FileText className="text-blue-600" size={24} />
//           Interview Questions & Answers
//         </h3>

//         {selectedCandidate.answers && selectedCandidate.answers.length > 0 ? (
//           <div className="space-y-6">
//             {selectedCandidate.answers.map((answer, idx) => {
//               const percentage = getScorePercentage(answer.score, answer.difficulty);
//               const difficultyStyle = DIFFICULTY_COLORS[answer.difficulty];
              
//               return (
//                 <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
//                   {/* Question Header */}
//                   <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//                     <div className="flex items-center gap-3">
//                       <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
//                         Q{idx + 1}
//                       </span>
//                       <span className={`${difficultyStyle.bg} ${difficultyStyle.text} px-3 py-1 rounded-full text-sm font-medium`}>
//                         {answer.difficulty}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-4 text-sm">
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <Clock size={16} />
//                         {answer.timeTaken}s
//                       </div>
//                       <div className={`font-bold ${getScoreColor(percentage)}`}>
//                         {answer.score}/{MAX_SCORES[answer.difficulty]} ({percentage}%)
//                       </div>
//                     </div>
//                   </div>

//                   {/* Question */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-700 mb-2">Question:</h4>
//                     <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
//                       {answer.question}
//                     </p>
//                   </div>

//                   {/* Answer */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-700 mb-2">Candidate's Answer:</h4>
//                     <p className="text-gray-700 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
//                       {answer.answer}
//                     </p>
//                   </div>

//                   {/* AI Feedback */}
//                   {answer.feedback && (
//                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg">
//                       <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//                         <CheckCircle size={18} />
//                         AI Feedback:
//                       </h4>
//                       <p className="text-purple-800 text-sm">
//                         {answer.feedback}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-12 text-gray-500">
//             <FileText size={48} className="mx-auto mb-3 text-gray-300" />
//             <p>No interview answers available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CandidateDetail;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User, Mail, Phone, Calendar, TrendingUp, Clock, CheckCircle, FileText, Award, Code } from 'lucide-react';
import { setSelectedCandidate } from '../../redux/slices/candidateSlice';
import { format } from 'date-fns';
import { DIFFICULTY_COLORS, MAX_SCORES } from '../../utils/constants';

const CandidateDetail = () => {
  const dispatch = useDispatch();
  const selectedCandidate = useSelector(state => state.candidate.selectedCandidate);

  if (!selectedCandidate) return null;

  const getScorePercentage = (score, difficulty) => {
    const maxScore = MAX_SCORES[difficulty];
    return Math.round((score / maxScore) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const overallPercentage = Math.round((selectedCandidate.totalScore / 90) * 100);

  // Calculate React and Node.js scores separately
  const reactAnswers = selectedCandidate.answers?.filter(a => a.category === 'react') || [];
  const nodeAnswers = selectedCandidate.answers?.filter(a => a.category === 'node') || [];
  const reactScore = reactAnswers.reduce((sum, a) => sum + a.score, 0);
  const nodeScore = nodeAnswers.reduce((sum, a) => sum + a.score, 0);

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => dispatch(setSelectedCandidate(null))}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Candidates List
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">{selectedCandidate.name}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {selectedCandidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {selectedCandidate.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Interviewed on {format(new Date(selectedCandidate.createdAt), 'MMMM dd, yyyy')}
                </div>
                {selectedCandidate.resumeFile && (
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    {selectedCandidate.resumeFile}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm min-w-[200px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award size={24} />
              <span className="text-sm font-medium">FINAL SCORE</span>
            </div>
            <div className="text-5xl font-bold text-center">
              {selectedCandidate.totalScore || 0}
            </div>
            <div className="text-center text-sm mt-2">
              out of 90 points ({overallPercentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {selectedCandidate.summary && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            AI Summary
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {selectedCandidate.summary}
          </p>
        </div>
      )}

      {/* Technology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Code className="text-white" size={24} />
            </div>
            <div>
              <div className="text-sm text-blue-700 font-medium">React.js</div>
              <div className="text-xs text-blue-600">{reactAnswers.length} questions</div>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {reactScore}/45
          </div>
          <div className="text-sm text-blue-700">
            {Math.round((reactScore / 45) * 100)}% accuracy
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <Code className="text-white" size={24} />
            </div>
            <div>
              <div className="text-sm text-green-700 font-medium">Node.js</div>
              <div className="text-xs text-green-600">{nodeAnswers.length} questions</div>
            </div>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">
            {nodeScore}/45
          </div>
          <div className="text-sm text-green-700">
            {Math.round((nodeScore / 45) * 100)}% accuracy
          </div>
        </div>
      </div>

      {/* Performance Overview by Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="text-sm text-green-700 font-medium mb-2">Easy Questions</div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Easy').reduce((sum, a) => sum + a.score, 0) || 0}/20
          </div>
          <div className="text-xs text-green-600">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Easy').length || 0} questions
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="text-sm text-yellow-700 font-medium mb-2">Medium Questions</div>
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Medium').reduce((sum, a) => sum + a.score, 0) || 0}/30
          </div>
          <div className="text-xs text-yellow-600">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Medium').length || 0} questions
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="text-sm text-red-700 font-medium mb-2">Hard Questions</div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Hard').reduce((sum, a) => sum + a.score, 0) || 0}/40
          </div>
          <div className="text-xs text-red-600">
            {selectedCandidate.answers?.filter(a => a.difficulty === 'Hard').length || 0} questions
          </div>
        </div>
      </div>

      {/* Question-by-Question Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          Interview Questions & Answers
        </h3>

        {selectedCandidate.answers && selectedCandidate.answers.length > 0 ? (
          <div className="space-y-6">
            {selectedCandidate.answers.map((answer, idx) => {
              const percentage = getScorePercentage(answer.score, answer.difficulty);
              const difficultyStyle = DIFFICULTY_COLORS[answer.difficulty];
              const techColor = answer.category === 'react' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
              const techName = answer.category === 'react' ? 'React.js' : 'Node.js';
              
              return (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  {/* Question Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                        Q{idx + 1}
                      </span>
                      <span className={`${difficultyStyle.bg} ${difficultyStyle.text} px-3 py-1 rounded-full text-sm font-medium`}>
                        {answer.difficulty}
                      </span>
                      <span className={`${techColor} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                        <Code size={14} />
                        {techName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        {answer.timeTaken}s
                      </div>
                      <div className={`font-bold ${getScoreColor(percentage)}`}>
                        {answer.score}/{MAX_SCORES[answer.difficulty]} ({percentage}%)
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Question:</h4>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                      {answer.question}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Candidate's Answer:</h4>
                    <p className="text-gray-700 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
                      {answer.answer}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  {answer.feedback && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <CheckCircle size={18} />
                        AI Feedback:
                      </h4>
                      <p className="text-purple-800 text-sm">
                        {answer.feedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No interview answers available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;