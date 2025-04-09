
import { toast } from '@/lib/toast';

// Define base URL for the API
const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Types
export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: number;
  userid: number;
  content: string;
  commentCount?: number;
  image?: string;
  timestamp?: number; // For sorting by recency
}

export interface Comment {
  id: number;
  postid: number;
  content: string;
}

// Helper function to handle API errors
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  toast.error(`Failed to fetch data. Please try again.`);
  return null;
};

// Get all users
export const getUsers = async (): Promise<Record<string, string> | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.users;
  } catch (error) {
    return handleApiError(error, "Error fetching users");
  }
};

// Get posts for a specific user
export const getUserPosts = async (userId: string): Promise<Post[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Add timestamp and random image to each post
    return data.posts.map((post: Post) => ({
      ...post,
      timestamp: Date.now() - Math.floor(Math.random() * 10000000), // Random timestamp for display
      image: getRandomImage(post.id),
    }));
  } catch (error) {
    return handleApiError(error, `Error fetching posts for user ${userId}`);
  }
};

// Get comments for a specific post
export const getPostComments = async (postId: number): Promise<Comment[] | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.comments;
  } catch (error) {
    return handleApiError(error, `Error fetching comments for post ${postId}`);
  }
};

// Helper function to get random image for posts
export const getRandomImage = (seed: number): string => {
  const imageOptions = [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1557682250-23c9d28b9219',
    'https://images.unsplash.com/photo-1561736778-92e52a7769ef',
    'https://images.unsplash.com/photo-1512314889357-e157c22f938d',
    'https://images.unsplash.com/photo-1591485423011-123ed3dbf1e4',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521',
    'https://images.unsplash.com/photo-1527689368864-4dbcb132065c',
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
    'https://images.unsplash.com/photo-1554177255-61502b352de3'
  ];
  
  // Use post ID as seed for consistent image selection
  const index = seed % imageOptions.length;
  return imageOptions[index];
};

// Helper function to get random avatar for users
export const getRandomAvatar = (userId: string): string => {
  const userIdNum = parseInt(userId);
  const avatarOptions = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
  ];
  
  // Use user ID as seed for consistent avatar selection
  const index = userIdNum % avatarOptions.length;
  return avatarOptions[index];
};
