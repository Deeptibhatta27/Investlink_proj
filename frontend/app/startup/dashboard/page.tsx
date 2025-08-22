// app/startup/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { decodeJWTToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import {
  MdDashboard,
  MdPeopleOutline,
  MdAttachMoney,
  MdDescription,
  MdOutlineMail,
  MdOutlinePerson,
  MdOutlineSettings,
  MdOutlineExitToApp,
  MdChevronRight,
  MdNotificationsNone,
  MdSearch,
  MdAdd,
  MdFileUpload,
  MdAttachFile,
  MdSend,
  MdClose,
} from 'react-icons/md';
import {
  FaHandHoldingDollar,
  FaTag,
  FaUsers,
  FaEye,
} from 'react-icons/fa6';
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal';
import FileUpload from '../../components/FileUpload';
import AddInvestorModal from '../../components/AddInvestorModal';
import AddFundingRoundModal from '../../components/AddFundingRoundModal';

export default function StartupDashboardPage() {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const [userName, setUserName] = useState('User');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'VC Partner', subject: 'Follow-up meeting', content: 'Let\'s schedule a follow-up to discuss the terms', time: '2 hours ago', unread: true },
    { id: 2, sender: 'Angel Investor', subject: 'Term sheet', content: 'I\'ve reviewed your deck and would like to proceed', time: '1 day ago', unread: false },
    { id: 3, sender: 'Investment Firm', subject: 'Due diligence', content: 'We need some additional documents for our process', time: '3 days ago', unread: false },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showAddFundingModal, setShowAddFundingModal] = useState(false);
  
  // Data states
  const [investors, setInvestors] = useState([
    { name: 'Tech Ventures', type: 'VC Firm', contact: '2 days ago', status: 'Interested' },
    { name: 'Angel Group', type: 'Angel Network', contact: '1 week ago', status: 'Reviewing' },
    { name: 'Capital Partners', type: 'PE Firm', contact: '3 weeks ago', status: 'Follow-up' },
    { name: 'Seed Fund', type: 'Micro VC', contact: '1 month ago', status: 'Not Interested' },
  ]);
  
  const [fundingRounds, setFundingRounds] = useState([
    { title: 'Seed Round', amount: '$500K', progress: '85%', status: 'Active', investors: 12 },
    { title: 'Series A', amount: '$2M', progress: '30%', status: 'Planning', investors: 3 },
    { title: 'Pre-Seed', amount: '$250K', progress: '100%', status: 'Completed', investors: 5 },
  ]);
  
  const [pitchDeckFiles, setPitchDeckFiles] = useState([
    { name: 'Startup_Pitch_Deck_v3.2.pdf', date: '2 weeks ago', size: '12.4 MB', url: '#' },
    { name: 'Startup_Pitch_Deck_v3.1.pdf', date: '1 month ago', size: '12.1 MB', url: '#' },
    { name: 'Startup_Pitch_Deck_v3.0.pdf', date: '2 months ago', size: '11.8 MB', url: '#' },
    { name: 'Startup_Pitch_Deck_v2.9.pdf', date: '3 months ago', size: '11.5 MB', url: '#' },
  ]);
  
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = decodeJWTToken(token);
          if (decodedToken && decodedToken.username) {
            setUserName(decodedToken.username);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const displayName = userName.includes('@') ? userName.split('@')[0] : userName;

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, unread: false} : msg
    ));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        subject: 'New message',
        content: newMessage,
        time: 'Just now',
        unread: false
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
    }
  };

  // Handler functions for modals and actions
  const handleAddInvestor = (investorData: any) => {
    const newInvestor = {
      name: investorData.company,
      type: investorData.type,
      contact: 'Just now',
      status: 'New Contact'
    };
    setInvestors([newInvestor, ...investors]);
    alert(`Investor ${investorData.name} from ${investorData.company} added successfully!`);
  };

  const handleAddFundingRound = (fundingData: any) => {
    const newRound = {
      title: fundingData.title,
      amount: fundingData.targetAmount,
      progress: '0%',
      status: fundingData.status,
      investors: 0
    };
    setFundingRounds([newRound, ...fundingRounds]);
    alert(`Funding round "${fundingData.title}" created successfully!`);
  };

  const handleFileUpload = (file: File) => {
    const newFile = {
      name: file.name,
      date: 'Just now',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file)
    };
    setPitchDeckFiles([newFile, ...pitchDeckFiles]);
    alert(`File "${file.name}" uploaded successfully!`);
  };

  const handleFileDelete = (fileName: string) => {
    setPitchDeckFiles(prev => prev.filter(file => file.name !== fileName));
    alert(`File "${fileName}" deleted successfully!`);
  };

  const handleFileDownload = (fileName: string) => {
    alert(`Downloading "${fileName}"... (This would trigger a real download in production)`);
  };

  const handleFilePreview = (fileName: string) => {
    alert(`Previewing "${fileName}"... (This would open a preview in production)`);
  };

  const handleBrowseInvestors = () => {
    alert('Opening investor directory... (This would navigate to investor listings)');
  };

  const handleViewDetails = (type: string, data: any) => {
    alert(`Viewing details for ${type}: ${data.title || data.name}`);
  };

  const handleSearch = (query: string) => {
    alert(`Searching for: ${query}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    switch (activeLink) {
      case 'Dashboard':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, {displayName}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
                  <MdNotificationsNone className="text-xl" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <button 
                  onClick={handleBrowseInvestors}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full flex items-center gap-2 shadow-md transition-all"
                >
                  <MdPeopleOutline className="text-xl" />
                  Browse Investors
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <FaHandHoldingDollar className="text-green-600 text-2xl" />, title: "Funds Raised", value: "$780K", change: "+$130K this month", bg: "bg-green-50", details: "Breakdown: Seed Round ($500K), Pre-Seed ($250K), Other ($30K)" },
                { icon: <FaTag className="text-blue-600 text-2xl" />, title: "Funding Goal", value: "$1M", change: "78% completed", bg: "bg-blue-50", details: "Target: $1M for Series A round. Current progress: 78% complete" },
                { icon: <FaUsers className="text-purple-600 text-2xl" />, title: "Interested Investors", value: "47", change: "+12 this week", bg: "bg-purple-50", details: "47 investors showing interest. 12 new this week, 35 from previous weeks" },
                { icon: <FaEye className="text-orange-600 text-2xl" />, title: "Pitch Views", value: "342", change: "+28%", bg: "bg-orange-50", details: "342 total pitch deck views. 28% increase from last month" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-105`}
                  onClick={() => alert(`${stat.title}: ${stat.value}\n${stat.change}\n\nDetails:\n${stat.details}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-xs">{stat.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-500 bg-white px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Funding Progress</h3>
                  <button 
                    onClick={() => handleViewDetails('funding progress', { title: 'Funding Progress' })}
                    className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    View details <MdChevronRight />
                  </button>
                </div>
                <div className="h-72 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">[Visualization]</p>
                    <p className="text-sm text-gray-500">Funding progress over time</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Investor Engagement</h3>
                  <button 
                    onClick={() => handleViewDetails('investor engagement', { title: 'Investor Engagement' })}
                    className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    View details <MdChevronRight />
                  </button>
                </div>
                <div className="h-72 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">[Visualization]</p>
                    <p className="text-sm text-gray-500">Investor interactions and interest</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <button 
                  onClick={() => alert('Opening full activity log...')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <MdPeopleOutline className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        New investor interest from {["Tech Ventures", "Capital Partners", "Angel Group"][item-1]}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item === 1 ? "2 hours ago" : item === 2 ? "Yesterday" : "3 days ago"}
                      </p>
                    </div>
                    <button 
                      onClick={() => alert(`Viewing details for ${["Tech Ventures", "Capital Partners", "Angel Group"][item-1]} interest`)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Investors':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Investor Network</h1>
                <p className="text-gray-500">Connect with potential investors</p>
              </div>
              <button 
                onClick={() => setShowAddInvestorModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
              >
                <MdAdd className="text-xl" />
                Add New Contact
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-12 border-b border-gray-200 font-medium text-gray-600">
                <div className="col-span-4 p-4">Investor</div>
                <div className="col-span-3 p-4">Type</div>
                <div className="col-span-3 p-4">Last Contact</div>
                <div className="col-span-2 p-4">Status</div>
              </div>

              {investors.map((investor, index) => (
                <div key={index} className="grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="col-span-4 p-4 font-medium">{investor.name}</div>
                  <div className="col-span-3 p-4 text-gray-600">{investor.type}</div>
                  <div className="col-span-3 p-4 text-gray-500">{investor.contact}</div>
                  <div className="col-span-2 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      investor.status === 'Interested' ? 'bg-green-100 text-green-800' :
                      investor.status === 'Reviewing' ? 'bg-blue-100 text-blue-800' :
                      investor.status === 'Follow-up' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {investor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Funding':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Funding Rounds</h1>
                <p className="text-gray-500">Manage your funding activities</p>
              </div>
              <button 
                onClick={() => setShowAddFundingModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
              >
                <MdAdd className="text-xl" />
                New Round
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fundingRounds.map((round, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{round.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      round.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      round.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {round.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-2">{round.amount}</p>
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          round.status === 'Active' ? 'bg-blue-500' :
                          round.status === 'Planning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} 
                        style={{ width: round.progress }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-500 mt-1">{round.progress} funded</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{round.investors} investors</span>
                    <button 
                      onClick={() => handleViewDetails('funding round', round)}
                      className="text-blue-600 hover:underline"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Pitch Deck':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Pitch Deck</h1>
                <p className="text-gray-500">Manage your investor presentation</p>
              </div>

            </div>

            {/* File Upload Component */}
            <FileUpload
              onFileUpload={handleFileUpload}
              onFileDelete={handleFileDelete}
              onFileDownload={handleFileDownload}
              onFilePreview={handleFilePreview}
              acceptedTypes={['.pdf', '.ppt', '.pptx', '.doc', '.docx']}
              maxSize={50}
              placeholder="Upload your pitch deck"
              className="bg-white p-6 rounded-xl shadow-sm"
            />

            {/* Existing Files */}
            {pitchDeckFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-4">Previous Versions</h3>
                  <div className="space-y-3">
                    {pitchDeckFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <MdAttachFile className="text-xl text-gray-400" />
                          <div>
                            <p className="text-gray-700">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.date} • {file.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleFilePreview(file.name)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            Preview
                          </button>
                          <button 
                            onClick={() => handleFileDownload(file.name)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'Messages':
        return (
          <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-500">Communicate with investors</p>
              </div>
              <button 
                onClick={() => alert('Opening new message composer... (This would open a message form in production)')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
              >
                <MdAdd className="text-xl" />
                New Message
              </button>
            </div>

            <div className="flex flex-1 gap-6">
              <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="divide-y divide-gray-100 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedMessage === message.id ? 'bg-blue-50' : ''
                      } ${message.unread ? 'font-semibold' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message.id);
                        markAsRead(message.id);
                      }}
                    >
                      <div className="flex justify-between">
                        <p className={`${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>{message.sender}</p>
                        <p className="text-xs text-gray-500">{message.time}</p>
                      </div>
                      <p className={`text-sm ${message.unread ? 'text-gray-800' : 'text-gray-600'} mt-1`}>{message.subject}</p>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMessage ? (
                <div className="hidden md:block md:w-2/3 bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                      {messages.find(m => m.id === selectedMessage)?.subject}
                    </h2>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-600">
                        From: {messages.find(m => m.id === selectedMessage)?.sender}
                      </p>
                      <p className="text-sm text-gray-500">
                        {messages.find(m => m.id === selectedMessage)?.time}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 whitespace-pre-line">
                      {messages.find(m => m.id === selectedMessage)?.content}
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-4">Reply</h3>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Type your reply here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={sendMessage}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all"
                        >
                          <MdSend className="text-xl" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex md:w-2/3 bg-white rounded-xl shadow-sm items-center justify-center">
                  <div className="text-center p-8">
                    <p className="text-gray-400 mb-4">Select a message to view</p>
                    <p className="text-gray-500">Choose from your conversations on the left</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'Profile':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
              <p className="text-gray-500">Manage your account information</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-800 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue={displayName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue={userName.includes('@') ? userName : 'user@example.com'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Founder & CEO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-800 mb-6">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="Tech Startup Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Software</option>
                      <option>Fintech</option>
                      <option>Healthtech</option>
                      <option>E-commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="2020-01-15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue="https://techstartup.com"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-end">
                  <button 
                    onClick={() => alert('Profile changes saved successfully! (This would update the backend in production)')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-500">Configure your account preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-medium text-gray-800 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                    <div className="space-y-3">
                      {['Email notifications', 'Push notifications', 'Investment alerts'].map((item) => (
                        <div key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`notif-${item}`}
                            defaultChecked
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`notif-${item}`} className="ml-3 block text-sm text-gray-700">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-end gap-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={() => alert('Settings saved successfully! (This would update the backend in production)')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col border-r border-gray-700">
        <div className="p-6 pb-4">
          <Logo size="md" className="text-white" />
          <p className="text-xs text-gray-400 mt-2 font-medium">STARTUP PORTAL</p>
        </div>

        <nav className="flex-grow px-4">
          <ul className="space-y-1">
            {[
              { name: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
              { name: 'Investors', icon: <MdPeopleOutline className="text-xl" /> },
              { name: 'Funding', icon: <MdAttachMoney className="text-xl" /> },
              { name: 'Pitch Deck', icon: <MdDescription className="text-xl" /> },
              { name: 'Messages', icon: <MdOutlineMail className="text-xl" /> },
              { name: 'Profile', icon: <MdOutlinePerson className="text-xl" /> },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveLink(item.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeLink === item.name
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveLink('Settings')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                  activeLink === 'Settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <MdOutlineSettings className="text-xl" />
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-300 hover:bg-gray-700 hover:text-red-400 transition-colors"
              >
                <MdOutlineExitToApp className="text-xl" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
        <ConfirmLogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
        />

        {/* Add Investor Modal */}
        <AddInvestorModal
          isOpen={showAddInvestorModal}
          onClose={() => setShowAddInvestorModal(false)}
          onAdd={handleAddInvestor}
        />

        {/* Add Funding Round Modal */}
        <AddFundingRoundModal
          isOpen={showAddFundingModal}
          onClose={() => setShowAddFundingModal(false)}
          onAdd={handleAddFundingRound}
        />
      </main>
    </div>
  );
}