import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { setSelectedCandidate } from '../../redux/slices/candidateSlice';
import { format } from 'date-fns';

const CandidateList = () => {
  const dispatch = useDispatch();
  const candidates = useSelector(state => state.candidate.candidates);
  const searchTerm = useSelector(state => state.ui.searchTerm);
  const sortBy = useSelector(state => state.ui.sortBy);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const searchLower = searchTerm.toLowerCase();
      return (
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.phone?.includes(searchTerm)
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.totalScore || 0) - (a.totalScore || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'status':
          if (a.status === b.status) return 0;
          return a.status === 'COMPLETED' ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, searchTerm, sortBy]);

  if (filteredAndSortedCandidates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <User size={64} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          {searchTerm ? 'No candidates found' : 'No candidates yet'}
        </h3>
        <p className="text-gray-500">
          {searchTerm 
            ? 'Try adjusting your search criteria'
            : 'Candidates will appear here once they complete interviews'}
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-blue-50 border-blue-200';
    if (score >= 30) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {filteredAndSortedCandidates.map((candidate) => (
        <div
          key={candidate.id}
          onClick={() => dispatch(setSelectedCandidate(candidate))}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 cursor-pointer transition-all transform hover:-translate-y-1"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Section - Candidate Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">
                    {candidate.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      {format(new Date(candidate.createdAt), 'MMM dd, yyyy • HH:mm')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {candidate.summary && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {candidate.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Right Section - Score & Status */}
            <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-3">
              {/* Score */}
              <div className={`${getScoreBgColor(candidate.totalScore || 0)} border-2 rounded-xl p-4 text-center min-w-[120px]`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={18} className={getScoreColor(candidate.totalScore || 0)} />
                  <span className="text-xs font-medium text-gray-600">SCORE</span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(candidate.totalScore || 0)}`}>
                  {candidate.totalScore || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">out of 90</div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  candidate.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {candidate.status === 'COMPLETED' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  {candidate.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                </span>

                {candidate.answers && candidate.answers.length > 0 && (
                  <div className="text-xs text-gray-500 text-center">
                    {candidate.answers.length}/6 questions
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {candidate.answers && candidate.answers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Avg. Time:</span>
                <span className="font-medium text-gray-700">
                  {Math.round(candidate.answers.reduce((sum, a) => sum + a.timeTaken, 0) / candidate.answers.length)}s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Easy:</span>
                <span className="font-medium text-gray-700">
                  {candidate.answers.filter(a => a.difficulty === 'Easy').reduce((sum, a) => sum + a.score, 0)}/20
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Medium:</span>
                <span className="font-medium text-gray-700">
                  {candidate.answers.filter(a => a.difficulty === 'Medium').reduce((sum, a) => sum + a.score, 0)}/30
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Hard:</span>
                <span className="font-medium text-gray-700">
                  {candidate.answers.filter(a => a.difficulty === 'Hard').reduce((sum, a) => sum + a.score, 0)}/40
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidateList;