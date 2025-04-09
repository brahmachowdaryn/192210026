
import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { 
  allPostsCache,
  getCachedUsers,
  getCachedUserPosts
} from '@/services/cache';
import { toast } from '@/lib/toast';

const Feed = () => {
  const [posts, setPosts] = useState<typeof allPostsCache>([]);
  const [loading, setLoading] = useState(allPostsCache.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadFeed();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      refreshFeed(false);
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadFeed = async () => {
    if (allPostsCache.length === 0) {
      setLoading(true);
      await refreshFeed(false);
      setLoading(false);
    } else {
      setPosts([...allPostsCache]);
    }
  };
  
  const refreshFeed = async (showToast = true) => {
    if (showToast) {
      setRefreshing(true);
    }
    
    // Get users
    const users = await getCachedUsers();
    if (!users) {
      setRefreshing(false);
      return;
    }
    
    // Select random users to refresh
    const userIds = Object.keys(users);
    const randomUserIds = userIds
      .sort(() => 0.5 - Math.random())
      .slice(0, 5); // Get 5 random users
    
    // Fetch posts for these users
    for (const userId of randomUserIds) {
      await getCachedUserPosts(userId);
    }
    
    // Update the posts state
    setPosts([...allPostsCache]);
    
    if (showToast) {
      toast.success("Feed refreshed with new posts!");
      setRefreshing(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={24} className="text-analytics-green" />
          <h1 className="text-2xl font-bold">Latest Posts</h1>
        </div>
        
        <Button
          onClick={() => refreshFeed(true)}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading the latest posts..." />
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts available yet. Please refresh to load posts.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
