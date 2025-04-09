
import React, { useState, useEffect } from 'react';
import { MessageSquare, BarChart } from 'lucide-react';
import { Post } from '@/services/api';
import { getCachedUsers, getCachedPostComments } from '@/services/cache';
import { getRandomAvatar } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  isTrending?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isTrending = false }) => {
  const [userName, setUserName] = useState<string>(`User ${post.userid}`);
  const [commentCount, setCommentCount] = useState<number>(post.commentCount || 0);
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  useEffect(() => {
    const fetchUserName = async () => {
      const users = await getCachedUsers();
      if (users) {
        setUserName(users[post.userid.toString()] || `User ${post.userid}`);
      }
    };
    
    const fetchComments = async () => {
      if (post.commentCount === undefined) {
        const comments = await getCachedPostComments(post.id);
        if (comments) {
          setCommentCount(comments.length);
        }
      }
    };
    
    const calculateTimeAgo = () => {
      if (post.timestamp) {
        setTimeAgo(formatDistanceToNow(post.timestamp, { addSuffix: true }));
      }
    };
    
    fetchUserName();
    fetchComments();
    calculateTimeAgo();
  }, [post]);
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden border 
        ${isTrending ? 'border-analytics-yellow' : 'border-gray-100'} 
        hover:shadow-md transition-shadow`}
    >
      {isTrending && (
        <div className="bg-analytics-yellow text-black px-4 py-1.5 flex items-center gap-2">
          <BarChart size={16} />
          <span className="font-medium text-sm">Trending Post</span>
        </div>
      )}
      
      {post.image && (
        <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={getRandomAvatar(post.userid.toString())} 
            alt={userName} 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium">{userName}</h3>
            {timeAgo && <p className="text-xs text-gray-500">{timeAgo}</p>}
          </div>
        </div>
        
        <p className="text-gray-800 mb-4">{post.content}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MessageSquare size={16} />
          <span>{commentCount} comments</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
