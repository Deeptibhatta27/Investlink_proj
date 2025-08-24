// app/investor/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getUserRole } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';

// Import icons from react-icons
import {
  MdDashboard,
  MdLightbulbOutline,
  MdOutlineAccountBalance,
  MdOutlineMail,
  MdOutlinePerson,
  MdOutlineSettings,
  MdOutlineExitToApp,
} from 'react-icons/md';

import {
  FaHandHoldingDollar,
  FaChartLine,
  FaBuilding,
  FaArrowTrendUp,
} from 'react-icons/fa6';

// Corrected import path for InvestmentCard and new OpportunityCard, MessageCard
import InvestmentCard from '../../components/InvestmentCard';
import OpportunityCard from '../../components/OpportunityCard';
import MessageCard from '../../components/MessageCard'; // Import the new MessageCard component
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal';

// Mock Data for Investment Portfolio (replace with real data later)
const mockInvestments: Array<{
  companyName: string;
  companySector: string;
  investmentStage: string;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  status: 'Active' | 'Monitoring' | 'Exiting';
  investedDate: string;
  initialInvestment: string;
  currentValue: string;
  ownership: string;
  roi: string;
  lastRound: string;
  nextMilestone: string;
  gainLoss: string;
  performanceStatus: 'Performing Well' | 'Review Required' | 'Exit Opportunity';
  performanceColor: 'green' | 'orange' | 'purple';
}> = [
  {
    companyName: "TechFlowAI",
    companySector: "AI/ML",
    investmentStage: "Series B",
    riskLevel: "Medium Risk",
    status: "Active",
    investedDate: "Jan 2024",
    initialInvestment: "$500,000",
    currentValue: "$1,200,000",
    ownership: "2.5%",
    roi: "+140%",
    lastRound: "Series C",
    nextMilestone: "IPO Preparation",
    gainLoss: "Gain: $700,000",
    performanceStatus: "Performing Well",
    performanceColor: "green",
  },
  {
    companyName: "HealthCore",
    companySector: "HealthTech",
    investmentStage: "Series A",
    riskLevel: "High Risk",
    status: "Active",
    investedDate: "Mar 2024",
    initialInvestment: "$300,000",
    currentValue: "$450,000",
    ownership: "1.8%",
    roi: "+50%",
    lastRound: "Series B",
    nextMilestone: "FDA Approval",
    gainLoss: "Gain: $150,000",
    performanceStatus: "Performing Well",
    performanceColor: "green",
  },
  {
    companyName: "FinanceHub",
    companySector: "FinTech",
    investmentStage: "Seed",
    riskLevel: "High Risk",
    status: "Monitoring",
    investedDate: "Nov 2023",
    initialInvestment: "$200,000",
    currentValue: "$180,000",
    ownership: "3.2%",
    roi: "-10%",
    lastRound: "Series A",
    nextMilestone: "Product Launch",
    gainLoss: "Loss: -$20,000",
    performanceStatus: "Review Required",
    performanceColor: "orange",
  },
  {
    companyName: "EcoTrade",
    companySector: "E-commerce",
    investmentStage: "Series A",
    riskLevel: "Low Risk",
    status: "Active",
    investedDate: "Aug 2023",
    initialInvestment: "$400,000",
    currentValue: "$720,000",
    ownership: "2.1%",
    roi: "+80%",
    lastRound: "Series B",
    nextMilestone: "International Expansion",
    gainLoss: "Gain: $320,000",
    performanceStatus: "Performing Well",
    performanceColor: "green",
  },
  {
    companyName: "DataSync Pro",
    companySector: "SaaS", // Corrected field
    investmentStage: "Series B", // Corrected field
    riskLevel: "Low Risk", // Corrected field
    status: "Exiting",
    investedDate: "Feb 2023", // Corrected field
    initialInvestment: "$600,000",
    currentValue: "$1,800,000",
    ownership: "1.5%",
    roi: "+200%", // Corrected field
    lastRound: "Series C", // Corrected field
    nextMilestone: "Acquisition Talks", // Corrected field
    gainLoss: "Gain: $1,200,000",
    performanceStatus: "Exit Opportunity",
    performanceColor: "purple",
  },
];

// Mock data for Portfolio Performance Chart
const portfolioPerformanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [{
    label: 'Portfolio Value',
    data: [700000, 720000, 750000, 742000, 780000, 800000, 820000, 785000, 810000, 840000, 860000],
    fill: true,
    borderColor: 'rgb(59, 130, 246)', // Tailwind blue-500
    backgroundColor: 'rgba(59, 130, 246, 0.2)', // Light blue fill
    tension: 0.3, // Smoothens the line
    pointBackgroundColor: 'rgb(59, 130, 246)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(59, 130, 246)',
  }]
};

// Mock data for Asset Allocation Chart
const assetAllocationData = {
  labels: ['Stocks', 'Bonds', 'ETFs', 'Crypto', 'Cash'],
  datasets: [{
    data: [45, 25, 15, 10, 5], // Percentages
    backgroundColor: [
      'rgb(59, 130, 246)', // Blue (Stocks)
      'rgb(34, 197, 94)',  // Green (Bonds)
      'rgb(251, 191, 36)', // Yellow (ETFs)
      'rgb(168, 85, 247)', // Purple (Crypto)
      'rgb(107, 114, 128)'  // Gray (Cash)
    ],
    hoverOffset: 4,
    borderWidth: 0, // Remove border for a cleaner look
  }]
};

// Mock data for Opportunities
const mockOpportunities: Array<{
  companyName: string;
  industry: string;
  stage: string;
  minInvestment: string;
  valuationCap: string;
  location: string;
  description: string;
  traction: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
}> = [
  {
    companyName: "Quantum Leap Innovations",
    industry: "Deep Tech",
    stage: "Seed",
    minInvestment: "$25,000",
    valuationCap: "$5M",
    location: "San Francisco, CA",
    description: "Developing next-gen quantum computing solutions for complex data analysis.",
    traction: "Pilot programs with 3 Fortune 500 companies.",
    status: "Open",
  },
  {
    companyName: "GreenHarvest Robotics",
    industry: "AgriTech",
    stage: "Series A",
    minInvestment: "$100,000",
    valuationCap: "$20M",
    location: "Rural Iowa, USA",
    description: "Autonomous farming robots designed to optimize crop yield and reduce waste.",
    traction: "Successful deployment on 500+ acres, 30% efficiency increase.",
    status: "Closing Soon",
  },
  {
    companyName: "EduStream VR",
    industry: "EdTech",
    stage: "Seed",
    minInvestment: "$15,000",
    valuationCap: "$3M",
    location: "London, UK",
    description: "Immersive VR platform for K-12 education, making learning interactive and engaging.",
    traction: "10,000+ active users, partnerships with 5 school districts.",
    status: "Open",
  },
  {
    companyName: "BioGen Therapeutics",
    industry: "BioTech",
    stage: "Series B",
    minInvestment: "$500,000",
    valuationCap: "$100M",
    location: "Boston, MA",
    description: "Pioneering gene-editing therapies for previously untreatable genetic diseases.",
    traction: "Phase 1 clinical trials successfully completed, strong preclinical data.",
    status: "Open",
  },
  {
    companyName: "AquaPure Solutions",
    industry: "CleanTech",
    stage: "Series A",
    minInvestment: "$75,000",
    valuationCap: "$15M",
    location: "Vancouver, Canada",
    description: "Innovative water purification systems for industrial and municipal applications.",
    traction: "Secured contracts with 2 major cities, patented filtration technology.",
    status: "Closing Soon",
  },
];

// Mock data for Messages
const mockMessages = [
  {
    id: 'msg1',
    sender: 'Startup X',
    subject: 'New Pitch Deck Available',
    snippet: 'Hi, we\'ve just updated our pitch deck with the latest Q2 results. Take a look!',
    time: '2h ago',
    isRead: false,
    fullMessage: 'Hi Sarika, hope you\'re having a great week. We\'ve just updated our pitch deck with the latest Q2 results and a new market analysis. We believe this provides a clearer picture of our growth trajectory. Please find it attached and let us know if you have any questions.',
  },
  {
    id: 'msg2',
    sender: 'Admin',
    subject: 'New Feature: Enhanced Analytics',
    snippet: 'Exciting news! Your dashboard now includes enhanced analytics for portfolio performance.',
    time: '1 day ago',
    isRead: false,
    fullMessage: 'Dear Investor, we are thrilled to announce the launch of our new enhanced analytics features on your dashboard. You can now dive deeper into your portfolio performance with more detailed metrics and visualizations. Visit the Dashboard section to explore!',
  },
  {
    id: 'msg3',
    sender: 'Investor Network',
    subject: 'Invitation: FinTech Summit',
    snippet: 'Join us for the annual FinTech Summit next month. RSVP by Friday.',
    time: '3 days ago',
    isRead: true,
    fullMessage: 'You\'re invited to the annual Global FinTech Summit! This year\'s event will feature leading experts, innovative startups, and unparalleled networking opportunities. The summit will be held virtually from Oct 20-22. Please RSVP by this Friday to secure your spot.',
  },
  {
    id: 'msg4',
    sender: 'HealthCore Team',
    subject: 'Q3 Update: FDA Approval Progress',
    snippet: 'Good news on the FDA front! We\'ve completed another milestone.',
    time: '1 week ago',
    isRead: true,
    fullMessage: 'Hello, we wanted to provide a quick update on our FDA approval process. We\'ve successfully completed the pre-submission meeting and received positive feedback. We\'re on track for our next phase. More details in the attached report.',
  },
];


export default function InvestorDashboardPage() {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const [userName, setUserName] = useState('User'); // State for user's name
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null); // State for selected message detail
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [replyText, setReplyText] = useState(''); // State for reply text

  // Mock profile data (replace with real data from authentication/backend)
  const [profileData, setProfileData] = useState({
    firstName: 'Sarika',
    lastName: 'Shrestha',
    email: 'sarikastha2704@gmail.com',
    phone: '123-456-7890',
    investmentFirm: 'Venture Capital Inc.',
    investmentRange: '$100k - $500k',
    preferredSectors: ['AI/ML', 'HealthTech', 'FinTech'],
  });

  // Refs for the canvas elements
  const performanceChartRef = useRef<HTMLCanvasElement | null>(null);
  const allocationChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart instances to destroy on re-render/unmount
  const performanceChartInstance = useRef<Chart | null>(null);
  const allocationChartInstance = useRef<Chart | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Client-side code to get and decode token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Use the utility function to decode token
          const { decodeJWTToken } = require('../../utils/auth');
          const decodedToken = decodeJWTToken(token);
          if (decodedToken && decodedToken.username) {
            setUserName(decodedToken.username);
            // Optionally update profile data from token if available
            setProfileData(prev => ({
                ...prev,
                firstName: decodedToken.firstName || prev.firstName,
                lastName: decodedToken.lastName || prev.lastName,
                email: decodedToken.email || prev.email,
                investmentFirm: decodedToken.investmentFirm || prev.investmentFirm,
                investmentRange: decodedToken.investmentRange || prev.investmentRange,
                preferredSectors: decodedToken.preferredSectors || prev.preferredSectors,
            }));
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          // Handle invalid token, e.g., redirect to login
        }
      }
    }
  }, []); // Run once on component mount

  useEffect(() => {
    // Function to render Portfolio Performance Chart
    const renderPerformanceChart = () => {
      if (performanceChartRef.current) {
        // Destroy existing chart instance if it exists
        if (performanceChartInstance.current) {
          performanceChartInstance.current.destroy();
        }

        const ctx = performanceChartRef.current.getContext('2d');
        if (ctx) {
          performanceChartInstance.current = new Chart(ctx, {
            type: 'line',
            data: portfolioPerformanceData,
            options: {
              responsive: true,
              maintainAspectRatio: false, // Allow chart to fill container
              plugins: {
                legend: {
                  display: false // Hide legend as per design
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.y);
                      }
                      return label;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: {
                    display: false // Hide x-axis grid lines
                  },
                  ticks: {
                    color: '#6B7280' // Gray-500 for tick labels
                  }
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#E5E7EB' // Light gray for y-axis grid lines
                  },
                  ticks: {
                    color: '#6B7280', // Gray-500 for tick labels
                    callback: function(value) {
                      if (typeof value === 'number') {
                        if (value >= 1000000) return `$${value / 1000000}M`;
                        if (value >= 1000) return `$${value / 1000}K`;
                        return `$${value}`;
                      }
                      return value;
                    }
                  }
                }
              }
            },
          });
        }
      }
    };

    // Function to render Asset Allocation Chart
    const renderAllocationChart = () => {
      if (allocationChartRef.current) {
        // Destroy existing chart instance if it exists
        if (allocationChartInstance.current) {
          allocationChartInstance.current.destroy();
        }

        const ctx = allocationChartRef.current.getContext('2d');
        if (ctx) {
          allocationChartInstance.current = new Chart(ctx, {
            type: 'doughnut', // Doughnut chart for asset allocation
            data: assetAllocationData,
            options: {
              responsive: true,
              maintainAspectRatio: false, // Allow chart to fill container
              plugins: {
                legend: {
                  display: false, // Hide default legend as we'll create a custom one
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed !== null) {
                        label += context.parsed + '%'; // Display percentage
                      }
                      return label;
                    }
                  }
                }
              },
            },
          });
        }
      }
    };

    // Only render charts if the Dashboard tab is active
    if (activeLink === 'Dashboard') {
      renderPerformanceChart();
      renderAllocationChart();
    }

    // Cleanup function to destroy charts on component unmount or tab change
    return () => {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
      if (allocationChartInstance.current) {
        allocationChartInstance.current.destroy();
      }
    };
  }, [activeLink]); // Re-run effect when activeLink changes

  // Handler for clicking a message card
  const handleMessageClick = (id: string) => {
    const message = mockMessages.find(msg => msg.id === id);
    if (message) {
      setSelectedMessage(message);
      // Optionally, mark message as read (for a real app, this would update backend)
      // For this mock, we'll just show it as read in the detail view
    }
  };

  // Handler for profile data changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for saving profile changes
  const handleSaveProfile = () => {
    // In a real application, you would send profileData to your backend here
    console.log("Saving profile data:", profileData);
    alert("Profile saved successfully! (This is a mock save)");
    // You might want to show a success message or redirect
  };

  // Handler for sending reply to messages
  const handleSendReply = (messageId: string, replyText: string) => {
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    
    // In a real application, you would send this reply to your backend here
    console.log("Sending reply to message:", messageId, "Reply:", replyText);
    alert("Reply sent successfully! (This is a mock send)");
    
    // Clear the reply text and close the message detail view
    setSelectedMessage(null);
  };

  // Handler for settings actions
  const handleSettingsAction = (action: string) => {
    switch (action) {
      case 'change_password':
        alert("Password change form would open here. This is a mock implementation.");
        break;
      case 'two_factor':
        alert("Two-factor authentication setup would open here. This is a mock implementation.");
        break;
      case 'login_history':
        alert("Login history would be displayed here. This is a mock implementation.");
        break;
      case 'export_data':
        alert("Data export would start here. This is a mock implementation.");
        break;
      case 'privacy_settings':
        alert("Privacy settings panel would open here. This is a mock implementation.");
        break;
      case 'save_settings':
        alert("Settings saved successfully! (This is a mock save)");
        break;
      default:
        break;
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/');
      if (response.ok) {
        alert('✅ Backend connected successfully! Django API is working.');
      } else {
        alert('❌ Backend connection failed. Status: ' + response.status);
      }
    } catch (error) {
      alert('❌ Backend connection error: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };


  const renderContent = () => {
    switch (activeLink) {
      case 'Dashboard':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-medium mr-4">
                  Welcome, {displayName}!
                </span>
                <p className="text-gray-600 ml-2">Here's your investment portfolio overview</p>
              </div>
                            <div className="flex space-x-4">
                <button
                  onClick={testBackendConnection}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-all"
                >
                  <MdDashboard className="mr-2 text-xl" />
                  Test Backend
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would refresh the dashboard data
                    alert("Refreshing dashboard data... (This is a mock refresh)");
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-all"
                >
                  <MdDashboard className="mr-2 text-xl" />
                  Refresh
                </button>
                <button
                  onClick={() => setActiveLink('Opportunities')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-all"
                >
                  <MdLightbulbOutline className="mr-2 text-xl" />
                  Browse Opportunities
                </button>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => {
                  alert("Total Invested: $2.4M\nBreakdown:\n- TechFlowAI: $500K\n- HealthCore: $300K\n- FinanceHub: $200K\n- EcoTrade: $400K\n- DataSync Pro: $600K\n- Other: $400K");
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 rounded-lg p-3 mr-3">
                    <FaHandHoldingDollar className="text-blue-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Total Invested</h3>
                    <p className="text-3xl font-bold text-gray-900">$2.4M</p>
                  </div>
                  <p className="ml-auto text-sm text-green-500 font-semibold">+12.5%</p>
                </div>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => {
                  alert("Portfolio Value: $3.1M\nCurrent Performance:\n- Total Gain: $700K\n- Best Performer: TechFlowAI (+140%)\n- Worst Performer: FinanceHub (-10%)\n- Average ROI: +45.8%");
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 rounded-lg p-3 mr-3">
                    <FaChartLine className="text-green-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Portfolio Value</h3>
                    <p className="text-3xl font-bold text-gray-900">$3.1M</p>
                  </div>
                  <p className="ml-auto text-sm text-green-500 font-semibold">+18.2%</p>
                </div>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => {
                  alert("Active Investments: 24\nStatus Breakdown:\n- Performing Well: 18\n- Review Required: 4\n- Exit Opportunity: 2\n\nClick 'Portfolio' tab for detailed view");
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 rounded-lg p-3 mr-3">
                    <FaBuilding className="text-purple-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Active Investments</h3>
                    <p className="text-3xl font-bold text-gray-900">24</p>
                  </div>
                  <p className="ml-auto text-sm text-green-500 font-semibold">+3</p>
                </div>
              </div>

              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => {
                  alert("Internal Rate of Return: 32.4%\nIRR Breakdown:\n- TechFlowAI: 45.2%\n- HealthCore: 38.1%\n- FinanceHub: 12.3%\n- EcoTrade: 28.7%\n- DataSync Pro: 41.9%\n\nIndustry Average: 18.6%");
                }}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-orange-100 rounded-lg p-3 mr-3">
                    <FaArrowTrendUp className="text-orange-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">IRR</h3>
                    <p className="text-3xl font-bold text-gray-900">32.4%</p>
                  </div>
                  <p className="ml-auto text-sm text-green-500 font-semibold">+2.1%</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
                <p className="text-gray-600 text-sm mb-4">Your portfolio value over the past 11 months</p>
                <div className="h-64"> {/* Set a fixed height for the chart container */}
                  <canvas ref={performanceChartRef}></canvas> {/* Canvas for the line chart */}
                </div>
              </div>

              {/* Sector Allocation Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Asset Allocation</h3> {/* Changed title */}
                <p className="text-gray-600 text-sm mb-4">How your investments are distributed</p>
                <div className="h-64 flex items-center justify-center"> {/* Flex for centering donut chart */}
                  <canvas ref={allocationChartRef} className="max-h-full max-w-full"></canvas> {/* Canvas for the donut chart */}
                </div>
                {/* Custom legend for Asset Allocation */}
                <div className="flex flex-wrap justify-center mt-4 text-sm text-gray-700">
                  {assetAllocationData.labels.map((label, index) => (
                    <span key={label} className="mr-4 mb-2 flex items-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: assetAllocationData.datasets[0].backgroundColor[index] }}
                      ></span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </>
        );

      case 'Portfolio':
        const profitableCount = mockInvestments.filter(inv => inv.performanceStatus === 'Performing Well').length;
        const underperformingCount = mockInvestments.filter(inv => inv.performanceStatus === 'Review Required').length;
        const exitReadyCount = mockInvestments.filter(inv => inv.performanceStatus === 'Exit Opportunity').length;

        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Investment Portfolio</h1>
                <p className="text-gray-600">Detailed view of your investment performance</p>
              </div>
              <div className="flex space-x-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {profitableCount} Profitable
                </span>
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {underperformingCount} Underperforming
                </span>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {exitReadyCount} Exit Ready
                </span>
              </div>
            </header>

            <section>
              {mockInvestments.map((investment, index) => (
                <InvestmentCard key={index} {...investment} />
              ))}
            </section>
          </>
        );

      case 'Opportunities':
        return (
          <div className="py-8 px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Current Opportunities</h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Discover a curated list of innovative startups actively seeking investment.
            </p>
            
            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Companies</label>
                    <input
                      type="text"
                      placeholder="Search by company name or industry..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => {
                        // In a real app, this would filter opportunities
                        console.log("Searching for:", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Stage</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Stages</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C">Series C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Industries</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="FinTech">FinTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="AgriTech">AgriTech</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => alert("Filters applied! (This is a mock implementation)")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockOpportunities.map((opportunity, index) => (
                <OpportunityCard key={index} {...opportunity} />
              ))}
            </div>
          </div>
        );

      case 'Messages':
        return (
          <div className="py-8 px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Messages</h2>
            {selectedMessage ? (
              // Message Detail View
              <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto border border-gray-200">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                >
                  <span className="text-2xl mr-2">&larr;</span> Back to Inbox
                </button>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">From:</span> {selectedMessage.sender}
                  <span className="ml-4 text-sm text-gray-500">({selectedMessage.time})</span>
                </p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-gray-800 leading-relaxed">{selectedMessage.fullMessage}</p>
                </div>
                {/* Reply section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <button 
                    onClick={() => handleSendReply(selectedMessage.id, replyText)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition-all"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            ) : (
              // Message List View (Inbox)
              <div className="max-w-3xl mx-auto">
                {mockMessages.map((message) => (
                  <MessageCard
                    key={message.id}
                    {...message}
                    onClick={handleMessageClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'Profile':
        return (
          <div className="py-8 px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Your Profile</h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Manage your personal information and investment preferences.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled // Email usually not editable directly
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-6 mt-8 border-t pt-6 border-gray-200">Investment Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="investmentFirm" className="block text-sm font-medium text-gray-700 mb-1">Investment Firm</label>
                  <input
                    type="text"
                    id="investmentFirm"
                    name="investmentFirm"
                    value={profileData.investmentFirm}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="investmentRange" className="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
                  <select
                    id="investmentRange"
                    name="investmentRange"
                    value={profileData.investmentRange}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a range</option>
                    <option value="$10k - $50k">$10k - $50k</option>
                    <option value="$50k - $100k">$50k - $100k</option>
                    <option value="$100k - $500k">$100k - $500k</option>
                    <option value="$500k - $1M">$500k - $1M</option>
                    <option value="$1M+">$1M+</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="preferredSectors" className="block text-sm font-medium text-gray-700 mb-1">Preferred Sectors (comma-separated)</label>
                  <input
                    type="text"
                    id="preferredSectors"
                    name="preferredSectors"
                    value={profileData.preferredSectors.join(', ')} // Join array for display
                    onChange={(e) => setProfileData(prev => ({ ...prev, preferredSectors: e.target.value.split(',').map(s => s.trim()) }))} // Split back to array
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., AI/ML, HealthTech, FinTech"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="py-8 px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Settings</h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Configure your account preferences and notification settings.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your investments via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Investment Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified about new opportunities and portfolio updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Account Security</h3>
              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => handleSettingsAction('change_password')}
                  className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </button>

                <button 
                  onClick={() => handleSettingsAction('two_factor')}
                  className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Enable additional security for your account</p>
                </button>

                <button 
                  onClick={() => handleSettingsAction('login_history')}
                  className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Login History</h4>
                  <p className="text-sm text-gray-600">View recent login activity</p>
                </button>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Data & Privacy</h3>
              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => handleSettingsAction('export_data')}
                  className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download your investment data</p>
                </button>

                <button 
                  onClick={() => handleSettingsAction('privacy_settings')}
                  className="w-full p-4 border border-gray-600 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                  <p className="text-sm text-gray-600">Manage your privacy preferences</p>
                </button>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleSettingsAction('save_settings')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Only use the part before @ if username looks like an email
  const displayName = userName.includes('@') ? userName.split('@')[0] : userName;
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8">
          <Logo size="md" className="text-white" />
          <p className="text-sm text-gray-400 mt-1">Investor Portal</p>
        </div>

        <nav className="flex-grow">
          <ul>
            <li className={`mb-2 rounded-lg ${activeLink === 'Dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => setActiveLink('Dashboard')}>
                <MdDashboard className="mr-3 text-2xl" />
                Dashboard
              </a>
            </li>
            <li className={`mb-2 rounded-lg ${activeLink === 'Opportunities' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => setActiveLink('Opportunities')}>
                <MdLightbulbOutline className="mr-3 text-2xl" />
                Opportunities
              </a>
            </li>
            <li className={`mb-2 rounded-lg ${activeLink === 'Portfolio' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => setActiveLink('Portfolio')}>
                <MdOutlineAccountBalance className="mr-3 text-2xl" />
                Portfolio
              </a>
            </li>
            <li className={`mb-2 rounded-lg ${activeLink === 'Messages' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => { 
                setActiveLink('Messages'); 
                setSelectedMessage(null); 
                setReplyText(''); 
              }}> {/* Reset selected message and reply text */}
                <MdOutlineMail className="mr-3 text-2xl" />
                Messages
              </a>
            </li>
            <li className={`mb-2 rounded-lg ${activeLink === 'Profile' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => setActiveLink('Profile')}>
                <MdOutlinePerson className="mr-3 text-2xl" />
                Profile
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          <ul>
            <li className={`mb-2 rounded-lg ${activeLink === 'Settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <a href="#" className="flex items-center p-3 text-white" onClick={() => setActiveLink('Settings')}>
                <MdOutlineSettings className="mr-3 text-2xl" />
                Settings
              </a>
            </li>
            <li className="hover:bg-gray-700 rounded-lg">
              <button onClick={() => setShowLogoutModal(true)} className="flex items-center p-3 text-red-400 w-full text-left">
                <MdOutlineExitToApp className="mr-3 text-2xl" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto relative">
        {renderContent()}
        <ConfirmLogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            handleLogout();
          }}
        />
      </main>
    </div>
  );
}
