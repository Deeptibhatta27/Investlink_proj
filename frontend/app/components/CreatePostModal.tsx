import { useState } from 'react';
import { FaImage, FaLink, FaTimes } from 'react-icons/fa';
import { networkService } from '../services/networkService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostData) => Promise<void>;
}

interface PostData {
  content: string;
  attachments?: {
    type: 'image' | 'link' | 'pdf';
    url: string;
    title?: string;
    description?: string;
  }[];
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<PostData['attachments']>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        content,
        attachments,
      });
      setContent('');
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Determine file type
      let fileType: 'image' | 'pdf' = 'image';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      }

      // Upload file to backend
      const uploadedUrl = await networkService.uploadFile(file);
      setAttachments([
        ...attachments ?? [],
        {
          type: fileType,
          url: uploadedUrl,
        },
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddLink = () => {
    const url = window.prompt('Enter the URL:');
    if (!url) return;

    setAttachments([
      ...attachments ?? [],
      {
        type: 'link',
        url,
        title: 'Link', // You might want to fetch the actual title from the URL
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create Post</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Attachments Preview */}
                  {attachments && attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative bg-gray-50 p-2 rounded-lg"
                        >
                          {attachment.type === 'image' ? (
                            <img
                              src={attachment.url}
                              alt="Preview"
                              className="max-h-40 rounded"
                            />
                          ) : (
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {attachment.title}
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                          >
                            <FaTimes className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaImage className="mr-2" />
                        Photo
                      </button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg className="mr-2 w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        PDF
                      </button>
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaLink className="mr-2" />
                        Link
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!content.trim() || isSubmitting}
                      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm ${
                        !content.trim() || isSubmitting
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
