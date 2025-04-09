
import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import PostCard from '@/components/PostCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { trendingPostsCache, updateTrendingPosts } from '@/services/cache';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState(trendingPostsCache);
  const [loading, setLoading] = useState(trendingPostsCache.length === 0);
  
  useEffect(() => {
    const loadTrendingPosts = async () => {
      if (trendingPostsCache.length === 0) {
        setLoading(true);
        updateTrendingPosts();
        setTrendingPosts(trendingPostsCache);
        setLoading(false);
      }
    };
    
    loadTrendingPosts();
    
    // Refresh data periodically
    const intervalId = setInterval(() => {
      updateTrendingPosts();
      setTrendingPosts([...trendingPostsCache]);
    }, 20000); // Every 20 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-analytics-purple" />
        <h1 className="text-2xl font-bold">Trending Posts</h1>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Analyzing trending posts..." />
      ) : (
        <div className="space-y-6">
          {trendingPosts.length > 0 ? (
            <>
              <p className="text-gray-500">
                Showing posts with the highest number of comments ({trendingPosts[0]?.commentCount || 0} comments)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingPosts.map(post => (
                  <PostCard key={post.id} post={post} isTrending={true} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No trending posts available yet. Please check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;
