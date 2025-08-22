// app/components/MessageCard.tsx
"use client";

import React from 'react';
import { MdMailOutline, MdMail } from 'react-icons/md'; // Icons for unread/read messages

interface MessageCardProps {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  isRead: boolean;
  onClick: (id: string) => void; // Function to handle click, passes message ID
}

const MessageCard: React.FC<MessageCardProps> = ({
  id,
  sender,
  subject,
  snippet,
  time,
  isRead,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out
        ${isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100 font-semibold'}
        mb-3 border border-gray-200`}
      onClick={() => onClick(id)}
    >
      {/* Read/Unread Icon */}
      <div className="flex-shrink-0 mr-4 text-2xl">
        {isRead ? <MdMailOutline className="text-gray-400" /> : <MdMail className="text-blue-500" />}
      </div>

      {/* Message Content */}
      <div className="flex-grow">
        <h3 className={`text-lg font-semibold ${isRead ? 'text-gray-800' : 'text-blue-700'}`}>
          {sender}
        </h3>
        <p className={`text-md ${isRead ? 'text-gray-600' : 'text-gray-800'}`}>
          {subject}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {snippet}
        </p>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 ml-4 text-sm text-gray-500">
        {time}
      </div>
    </div>
  );
};

export default MessageCard;
