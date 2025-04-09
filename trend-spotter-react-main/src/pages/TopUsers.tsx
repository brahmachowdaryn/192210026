
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import UserCard from '@/components/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { topUsersCache, updateTopUsersCache } from '@/services/cache';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState(topUsersCache);
  const [loading, setLoading] = useState(topUsersCache.length === 0);
  
  useEffect(() => {
    const loadTopUsers = async () => {
      if (topUsersCache.length === 0) {
        setLoading(true);
        await updateTopUsersCache();
        setTopUsers(topUsersCache);
        setLoading(false);
      }
    };
    
    loadTopUsers();
    
    // Refresh data periodically
    const intervalId = setInterval(async () => {
      await updateTopUsersCache();
      setTopUsers([...topUsersCache]);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users size={24} className="text-analytics-blue" />
        <h1 className="text-2xl font-bold">Top 5 Users with Most Comments</h1>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading top users..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topUsers.length > 0 ? (
            topUsers.map((user, index) => (
              <UserCard
                key={user.userId}
                userId={user.userId}
                userName={user.userName}
                commentCount={user.commentCount}
                rank={index + 1}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No user data available yet. Please check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopUsers;
