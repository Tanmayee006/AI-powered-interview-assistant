import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Users } from 'lucide-react';
import { setActiveTab } from '../../redux/slices/uiSlice';

const Tabs = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.ui.activeTab);

  const tabs = [
    { id: 'interviewee', label: 'Interviewee', icon: MessageSquare },
    { id: 'interviewer', label: 'Interviewer Dashboard', icon: Users }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <Icon size={20} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;