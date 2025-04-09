
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getRandomAvatar } from '@/services/api';

interface UserCardProps {
  userId: string;
  userName: string;
  commentCount: number;
  rank: number;
}

const UserCard: React.FC<UserCardProps> = ({ userId, userName, commentCount, rank }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-6 flex items-center gap-4">
        <div className="relative">
          <div className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center
            ${rank === 1 ? 'bg-analytics-yellow text-black' : 
              rank === 2 ? 'bg-gray-300 text-gray-800' : 
              rank === 3 ? 'bg-analytics-teal text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {rank}
          </div>
          <img 
            src={getRandomAvatar(userId)}
            alt={userName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg">{userName}</h3>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <span className="font-medium text-analytics-purple">{commentCount}</span>
            <MessageSquare size={16} className="text-gray-400" />
            <span>comments on posts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
