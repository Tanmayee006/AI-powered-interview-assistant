import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ArrowUpDown } from 'lucide-react';
import { setSearchTerm, setSortBy } from '../../redux/slices/uiSlice';

const SearchSort = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(state => state.ui.searchTerm);
  const sortBy = useSelector(state => state.ui.sortBy);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[200px]"
        >
          <option value="score">Sort by Score (High to Low)</option>
          <option value="date">Sort by Date (Recent First)</option>
          <option value="name">Sort by Name (A-Z)</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>
    </div>
  );
};

export default SearchSort;