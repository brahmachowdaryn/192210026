import { Post, Comment, getUsers, getUserPosts, getPostComments } from './api';

// Cache implementation
interface Cache<T> {
  data: T | null;
  timestamp: number;
  expiry: number; // expiry time in milliseconds
}

// Initialize caches
const userCache: Cache<Record<string, string>> = {
  data: null,
  timestamp: 0,
  expiry: 5 * 60 * 1000, // 5 minutes
};

const postsCache: Record<string, Cache<Post[]>> = {};
const commentsCache: Record<number, Cache<Comment[]>> = {};

// Cache for tracking comment counts per post
export const commentCountCache: Record<number, number> = {};

// Cache for tracking all posts
export let allPostsCache: Post[] = [];

// Cache for tracking top users
export let topUsersCache: { userId: string, userName: string, commentCount: number }[] = [];

// Cache for tracking trending posts
export let trendingPostsCache: Post[] = [];

// Function to get users with cache
export const getCachedUsers = async (): Promise<Record<string, string> | null> => {
  const now = Date.now();
  
  // If cache is valid, return cached data
  if (userCache.data && now - userCache.timestamp < userCache.expiry) {
    return userCache.data;
  }
  
  // Otherwise fetch new data and update cache
  const users = await getUsers();
  if (users) {
    userCache.data = users;
    userCache.timestamp = now;
  }
  return users;
};

// Function to get user posts with cache
export const getCachedUserPosts = async (userId: string): Promise<Post[] | null> => {
  const now = Date.now();
  
  // Initialize cache entry if it doesn't exist
  if (!postsCache[userId]) {
    postsCache[userId] = {
      data: null,
      timestamp: 0,
      expiry: 30 * 1000, // 30 seconds for posts (to see real-time updates)
    };
  }
  
  // If cache is valid, return cached data
  if (postsCache[userId].data && now - postsCache[userId].timestamp < postsCache[userId].expiry) {
    return postsCache[userId].data;
  }
  
  // Otherwise fetch new data and update cache
  const posts = await getUserPosts(userId);
  if (posts) {
    postsCache[userId].data = posts;
    postsCache[userId].timestamp = now;
    
    // Update all posts cache as well
    updateAllPostsCache(posts, userId);
  }
  return posts;
};

// Function to get post comments with cache
export const getCachedPostComments = async (postId: number): Promise<Comment[] | null> => {
  const now = Date.now();
  
  // Initialize cache entry if it doesn't exist
  if (!commentsCache[postId]) {
    commentsCache[postId] = {
      data: null,
      timestamp: 0,
      expiry: 60 * 1000, // 1 minute for comments
    };
  }
  
  // If cache is valid, return cached data
  if (commentsCache[postId].data && now - commentsCache[postId].timestamp < commentsCache[postId].expiry) {
    return commentsCache[postId].data;
  }
  
  // Otherwise fetch new data and update cache
  const comments = await getPostComments(postId);
  if (comments) {
    commentsCache[postId].data = comments;
    commentsCache[postId].timestamp = now;
    
    // Update comment count cache
    commentCountCache[postId] = comments.length;
    
    // Update trending posts
    updateTrendingPosts();
  }
  return comments;
};

// Update the all posts cache with new posts
const updateAllPostsCache = (newPosts: Post[], userId: string) => {
  // Remove existing posts for this user
  allPostsCache = allPostsCache.filter(post => post.userid.toString() !== userId);
  
  // Add new posts
  allPostsCache = [...allPostsCache, ...newPosts];
  
  // Sort by timestamp (newest first)
  allPostsCache.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

// Update top users cache
export const updateTopUsersCache = async () => {
  // Get all users
  const users = await getCachedUsers();
  if (!users) return;
  
  // Calculate comment counts for each user
  const userCommentCounts: Record<string, number> = {};
  
  // Check each post's comments
  for (const post of allPostsCache) {
    const postId = post.id;
    const userId = post.userid.toString();
    
    // Get comment count for this post
    if (!commentCountCache[postId]) {
      // Fetch comments if we don't have them cached
      const comments = await getCachedPostComments(postId);
      if (comments) {
        commentCountCache[postId] = comments.length;
      } else {
        commentCountCache[postId] = 0;
      }
    }
    
    // Add to user's comment count
    if (!userCommentCounts[userId]) {
      userCommentCounts[userId] = 0;
    }
    userCommentCounts[userId] += commentCountCache[postId] || 0;
  }
  
  // Create sorted list of top users
  const topUsers = Object.entries(userCommentCounts)
    .map(([userId, commentCount]) => ({
      userId,
      userName: users[userId] || `User ${userId}`,
      commentCount
    }))
    .sort((a, b) => b.commentCount - a.commentCount)
    .slice(0, 5); // Get top 5
  
  topUsersCache = topUsers;
};

// Update trending posts cache
export const updateTrendingPosts = () => {
  // Find the maximum comment count
  let maxCommentCount = 0;
  
  // Add comment counts to posts
  const postsWithComments = allPostsCache.map(post => {
    const commentCount = commentCountCache[post.id] || 0;
    if (commentCount > maxCommentCount) {
      maxCommentCount = commentCount;
    }
    return { ...post, commentCount };
  });
  
  // Filter posts with maximum comment count
  trendingPostsCache = postsWithComments
    .filter(post => post.commentCount === maxCommentCount && maxCommentCount > 0)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

// Initialize data by fetching users and their posts
export const initializeData = async () => {
  try {
    // Get all users
    const users = await getCachedUsers();
    if (!users) return;
    
    // Get posts for each user (limit to first 10 users for initial load)
    const userIds = Object.keys(users).slice(0, 10);
    
    for (const userId of userIds) {
      await getCachedUserPosts(userId);
    }
    
    // Get comments for initial posts (limit to first 20 posts for initial load)
    const initialPosts = allPostsCache.slice(0, 20);
    
    for (const post of initialPosts) {
      await getCachedPostComments(post.id);
    }
    
    // Update top users and trending posts
    await updateTopUsersCache();
    updateTrendingPosts();
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};
