'use client';

import { useState } from 'react';
import { FaVideo, FaFileUpload, FaTrash, FaEdit } from 'react-icons/fa';

interface StartupPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    video_url?: string;
    thumbnail_url?: string;
    created_at: string;
    author: {
      name: string;
      company: string;
      role: string;
      imageUrl?: string;
    };
  };
  onLike: () => void;
}

export default function StartupPost({ post, onLike }: StartupPostProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Author Header */}
      <div className="p-4 flex items-center border-b border-gray-100">
        <img
          className="w-12 h-12 rounded-full mr-4"
          src={post.author.imageUrl || '/images/profile-placeholder.jpg'}
          alt={post.author.name}
          loading="lazy"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
          <p className="text-sm text-gray-500">{post.author.company} • {formatDate(post.created_at)}</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={onLike}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Like
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Video */}
      {post.video_url && (
        <div className="relative pt-[56.25%] bg-black">
          <video
            className="absolute top-0 left-0 w-full h-full object-contain"
            controls
            src={post.video_url}
            poster={post.thumbnail_url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
