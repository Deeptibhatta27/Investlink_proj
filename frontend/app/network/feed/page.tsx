import { useEffect, useState } from 'react';
import { networkService } from '../../services/networkService';
import NetworkPost from '../../components/NetworkPost';
import CreatePostModal from '../../components/CreatePostModal';
import NetworkSidebar from '../../components/NetworkSidebar';
import { useInView } from 'react-intersection-observer';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function NetworkFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const newPosts = await networkService.getNetworkPosts({ page: pageNum });
      setPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length > 0);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchPosts(nextPage);
        return nextPage;
      });
    }
  }, [inView, hasMore, loading]);

  const handleCreatePost = async (postData) => {
    try {
      await networkService.createPost(postData);
      fetchPosts(1); // Refresh posts
      setIsCreatePostOpen(false);
    } catch (error: any) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <NetworkSidebar />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Button */}
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <p className="text-gray-500">Share your thoughts, updates, or opportunities...</p>
                </div>
              </div>
            </button>

            {/* Posts Feed */}
            {error ? (
              <div className="bg-red-50 p-4 rounded-xl text-red-600">
                {error}
                <button
                  onClick={() => fetchPosts(1)}
                  className="ml-2 text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <NetworkPost key={post.id} post={post} />
                ))}
                {/* Loading indicator */}
                <div ref={ref} className="py-4 text-center">
                  {loading && <LoadingSpinner />}
                  {!hasMore && posts.length > 0 && (
                    <p className="text-gray-500">No more posts to load</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Suggestions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Suggested Connections</h3>
              {/* Add suggested connections component here */}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
