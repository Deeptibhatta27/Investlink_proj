import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { FaThumbsUp, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import { networkService } from '../services/networkService';

interface NetworkPostProps {
  post: {
    id: string;
    author: {
      id: number;
      name: string;
      role: string;
      company: string;
      imageUrl: string;
    };
    content: string;
    attachments?: {
      type: 'image' | 'link' | 'pdf';
      url: string;
      title?: string;
      description?: string;
    }[];
    likes: number;
    comments: number;
    createdAt: string;
    isLiked: boolean;
    isSaved: boolean;
  };
}

export default function NetworkPost({ post }: NetworkPostProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      await networkService.toggleLikePost(post.id);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async () => {
    try {
      await networkService.toggleSavePost(post.id);
      // Since there's no backend implementation, we'll just toggle the state locally
      // and show a message to the user
      setIsSaved(!isSaved);
      alert('Save feature not implemented in backend yet');
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={post.author.imageUrl}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <p className="text-sm text-gray-500">
              {post.author.role} at {post.author.company} •{' '}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-2">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="border-t border-gray-100">
          {post.attachments.map((attachment, index) => (
            attachment.type === 'image' ? (
              <div key={index} className="relative aspect-video">
                <Image
                  src={attachment.url}
                  alt="Post attachment"
                  fill
                  className="object-cover"
                />
              </div>
            ) : attachment.type === 'pdf' ? (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 hover:bg-gray-50 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600">PDF Document</h4>
                    <p className="text-sm text-gray-500">Click to view</p>
                  </div>
                </div>
              </a>
            ) : (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 hover:bg-gray-50"
              >
                <h4 className="font-medium text-blue-600">{attachment.title}</h4>
                <p className="text-sm text-gray-500">{attachment.description}</p>
              </a>
            )
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-100 text-sm text-gray-500">
        <span>{likes} likes</span>
        <span className="mx-2">•</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-2 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaThumbsUp className="mr-2" />
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaComment className="mr-2" />
          Comment
        </button>
        <button className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <FaShare className="mr-2" />
          Share
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isSaved ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaBookmark className="mr-2" />
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 p-4">
          {/* Add comments component here */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
