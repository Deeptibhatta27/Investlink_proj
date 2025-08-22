'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaGlobe, FaUsers, FaHandshake, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import ProtectedLayout from '@/components/ProtectedLayout';
import NetworkCard from '@/components/NetworkCard';
import NetworkSearch from '@/components/NetworkSearch';
import MessageModal from '@/components/MessageModal';
import StartupPost from '@/components/StartupPost';
import CreateStartupPostModal from '@/components/CreateStartupPostModal';
import { networkService, NetworkMember, NetworkFilters } from '@/services/networkService';
import { startupPostService, StartupPost as IStartupPost } from '@/services/startupPostService';
import { useAuth } from '@/contexts/AuthContext';

// Sample data for role-specific viewing
const sampleStartups: NetworkMember[] = [
  {
    id: 1,
    name: 'TechInnovate AI',
    role: 'Startup',
    company: 'TechInnovate AI',
    description: 'Developing cutting-edge AI solutions for enterprise automation.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'startup',
    industry: 'Artificial Intelligence',
    location: 'Nepal',
    linkedinUrl: 'https://linkedin.com',
    email: 'contact@techinnovate.ai'
  },
  {
    id: 2,
    name: 'GreenEnergy Solutions',
    role: 'Startup',
    company: 'GreenEnergy Solutions',
    description: 'Revolutionary sustainable energy storage solutions.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'startup',
    industry: 'Clean Energy',
    location: 'USA',
    linkedinUrl: 'https://linkedin.com',
    email: 'info@greenenergy.com'
  },
  {
    id: 3,
    name: 'Digital India Tech',
    role: 'Startup',
    company: 'Digital India Tech',
    description: 'Digital transformation solutions for businesses in India.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'startup',
    industry: 'Information Technology',
    location: 'India',
    linkedinUrl: 'https://linkedin.com',
    email: 'contact@digitalindia.tech'
  },
  {
    id: 4,
    name: 'China IoT Solutions',
    role: 'Startup',
    company: 'China IoT Solutions',
    description: 'IoT solutions for smart manufacturing.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'startup',
    industry: 'IoT',
    location: 'China',
    linkedinUrl: 'https://linkedin.com',
    email: 'info@chinaiot.com'
  }
];

const sampleInvestors: NetworkMember[] = [
  {
    id: 1,
    name: 'Nepal Investment Partners',
    role: 'Investor',
    company: 'Nepal Investment Partners',
    description: 'Leading investment firm in Nepal focusing on local startups.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'investor',
    industry: 'Venture Capital',
    location: 'Nepal',
    linkedinUrl: 'https://linkedin.com',
    email: 'invest@nepalinvestments.com'
  },
  {
    id: 2,
    name: 'US Innovation Capital',
    role: 'Investor',
    company: 'US Innovation Capital',
    description: 'Early-stage investment firm focusing on tech and sustainability.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'investor',
    industry: 'Venture Capital',
    location: 'USA',
    linkedinUrl: 'https://linkedin.com',
    email: 'investments@usinnovation.com'
  },
  {
    id: 3,
    name: 'India Growth Fund',
    role: 'Investor',
    company: 'India Growth Fund',
    description: 'Premier investment fund focusing on Indian startups.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'investor',
    industry: 'Venture Capital',
    location: 'India',
    linkedinUrl: 'https://linkedin.com',
    email: 'invest@indiagrowth.com'
  },
  {
    id: 4,
    name: 'China Tech Investments',
    role: 'Investor',
    company: 'China Tech Investments',
    description: 'Technology-focused investment firm in China.',
    imageUrl: '/images/profile-placeholder.jpg',
    type: 'investor',
    industry: 'Venture Capital',
    location: 'China',
    linkedinUrl: 'https://linkedin.com',
    email: 'info@chinatech.invest'
  }
];

const availableLocations = ['all', 'Nepal', 'USA', 'India', 'China'];
const availableIndustries = ['all', 'Artificial Intelligence', 'Clean Energy', 'Information Technology', 'IoT', 'Venture Capital'];

export default function NetworkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NetworkFilters>({
    type: user?.role === 'investor' ? 'startup' : 'investor',
    location: 'all',
    industry: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkMembers, setNetworkMembers] = useState<NetworkMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<NetworkMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [startupPosts, setStartupPosts] = useState<IStartupPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Initialize with sample data based on user role
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const initialMembers = user.role === 'investor' ? sampleStartups : sampleInvestors;
    setNetworkMembers(initialMembers);
    setFilteredMembers(initialMembers);
    setLoading(false);
    loadStartupPosts();
  }, [user, router]);

  const loadStartupPosts = async () => {
    try {
      setLoadingPosts(true);
      // Try to fetch posts from the API
      let posts: IStartupPost[] = [];
      try {
        posts = await startupPostService.getPosts();
      } catch (apiError) {
        console.warn('Failed to fetch posts from API, using sample data', apiError);
        // Fallback to sample data if API fails
        posts = [
          {
            id: '1',
            content: 'We just launched our new AI-powered analytics platform! Check it out at example.com',
            likes: 5,
            liked: false,
            createdAt: new Date().toISOString(),
            author: {
              id: '1',
              name: 'TechInnovate AI',
              imageUrl: '/images/profile-placeholder.jpg'
            }
          },
          {
            id: '2',
            content: 'Looking for seed funding to expand our operations in Southeast Asia. We have 200% YoY growth!',
            likes: 12,
            liked: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            author: {
              id: '2',
              name: 'GreenEnergy Solutions',
              imageUrl: '/images/profile-placeholder.jpg'
            }
          }
        ];
      }
      setStartupPosts(posts);
    } catch (error) {
      console.error('Failed to load startup posts:', error);
      setStartupPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreatePost = async (data: { content: string; videoFile?: File }) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.videoFile) {
        formData.append('video', data.videoFile);
      }
      
      // In a real app, you would call the API here
      // await startupPostService.createPost(formData);
      
      // For demo purposes, we'll create a local post
      const newPost: IStartupPost = {
        id: Date.now().toString(),
        content: data.content,
        likes: 0,
        liked: false,
        createdAt: new Date().toISOString(),
        author: {
          id: String(user?.id || '1'),
          name: user?.username || 'Your Startup',
          imageUrl: '/images/profile-placeholder.jpg'
        }
      };
      
      setStartupPosts(prev => [newPost, ...prev]);
      setShowCreatePostModal(false);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      // In a real app, you would call the API here
      // await startupPostService.likePost(postId);
      
      // For demo purposes, we'll update the local state
      setStartupPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
            liked: !post.liked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Filter members based on search and filters
  const applyFilters = useCallback(() => {
    const filtered = networkMembers.filter(member => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          member.name.toLowerCase().includes(query) ||
          member.company?.toLowerCase().includes(query) ||
          member.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type !== 'all' && member.type !== filters.type) return false;

      // Location filter
      if (filters.location !== 'all' && member.location !== filters.location) return false;

      // Industry filter
      if (filters.industry !== 'all' && member.industry !== filters.industry) return false;

      return true;
    });

    setFilteredMembers(filtered);
  }, [networkMembers, searchQuery, filters]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: NetworkFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Ensure type filter matches user role
      type: user?.role === 'investor' ? 'startup' : 'investor'
    }));
  };

  return (
    <ProtectedLayout allowedRoles={['investor', 'startup']}>
      <div className="bg-white text-gray-800 min-h-screen">
        <main className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGlobe className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {user?.role === 'investor' ? 'Startup Network' : 'Investor Network'}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {user?.role === 'investor' 
                  ? 'Discover promising startups and connect with founders'
                  : 'Connect with potential investors and grow your startup'}
              </p>
            </div>

            <NetworkSearch 
              onSearch={handleSearch} 
              onFilter={handleFilter}
            />

            {/* Startup Posts Section */}
            {user?.role === 'startup' && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
                  <button
                    onClick={() => setShowCreatePostModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    Create Post
                  </button>
                </div>

                {loadingPosts ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : startupPosts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No posts yet. Create your first post!</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {startupPosts.map((post) => (
                      <div key={post.id} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <p className="text-gray-600">{post.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <CreateStartupPostModal
                  isOpen={showCreatePostModal}
                  onClose={() => setShowCreatePostModal(false)}
                  onSubmit={handleCreatePost}
                />
              </div>
            )}

            {/* Network Members Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-red-50 rounded-xl border border-red-200">
                <FaExclamationTriangle className="w-12 h-12 mb-4 text-red-600" />
                <p className="text-lg font-semibold text-red-700 text-center mb-2">{error}</p>
                <p className="text-red-600 text-sm mb-4 text-center">
                  There was a problem loading the network members. Please try again.
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    const initialMembers = user?.role === 'investor' ? sampleStartups : sampleInvestors;
                    setNetworkMembers(initialMembers);
                    setFilteredMembers(initialMembers);
                    setLoading(false);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Loading
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-gray-50 rounded-xl">
                <p className="text-lg font-semibold text-gray-700">No matching members found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      type: user?.role === 'investor' ? 'startup' : 'investor',
                      location: 'all',
                      industry: 'all'
                    });
                  }}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredMembers.map((member) => (
                  <NetworkCard
                    key={member.id}
                    {...member}
                    onMessage={() => {
                      setSelectedMember(member);
                      setShowMessageModal(true);
                    }}
                  />
                ))}
              </div>
            )}

            {selectedMember && user && (
              <MessageModal
                isOpen={showMessageModal}
                onClose={() => {
                  setShowMessageModal(false);
                  setSelectedMember(null);
                }}
                recipientId={selectedMember.id}
                recipientName={selectedMember.name}
                currentUserId={user.id}
              />
            )}

            {/* Role-specific information card */}
            <div className="mb-16">
              <div className="bg-blue-50 p-8 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {user?.role === 'investor' ? (
                      <FaUsers className="w-6 h-6 text-blue-600" />
                    ) : (
                      <FaHandshake className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {user?.role === 'investor' ? 'Find Promising Startups' : 'Connect with Investors'}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {user?.role === 'investor' 
                    ? 'Access a curated list of innovative startups across all industries and stages. Find your next investment opportunity with our comprehensive filters and matching algorithms.'
                    : 'Get discovered by qualified investors actively looking for opportunities. Showcase your business to the right audience and secure funding faster.'}
                </p>
                <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                  {user?.role === 'investor' ? (
                    <>
                      <li>View detailed startup profiles</li>
                      <li>Access pitch decks and financials</li>
                      <li>Direct messaging with founders</li>
                    </>
                  ) : (
                    <>
                      <li>Showcase your startup to active investors</li>
                      <li>Get matched with relevant investors</li>
                      <li>Track investor engagement</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Our Network Works</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Create Profile",
                    description: "Complete your profile with key details about your investment criteria or startup",
                    icon: <FaUsers className="w-8 h-8 text-blue-600" />
                  },
                  {
                    title: "Get Matched",
                    description: "Our algorithm suggests the most relevant connections",
                    icon: <FaHandshake className="w-8 h-8 text-blue-600" />
                  },
                  {
                    title: "Start Engaging",
                    description: "Connect directly with your matches through our platform",
                    icon: <FaGlobe className="w-8 h-8 text-blue-600" />
                  }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}