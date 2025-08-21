// app/components/InvestmentCard.tsx
"use client"; // This component needs to run on the client-side for interactivity

import React, { useState } from 'react';
import { FaChartLine, FaCalendarAlt, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'; // Icons for ROI, date, exit
import { MdOutlineAssessment } from 'react-icons/md'; // For the company icon

interface InvestmentCardProps {
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
  performanceColor: 'green' | 'orange' | 'purple'; // For the performance indicator
}

// Helper function to get Tailwind classes for risk level tags
const getRiskLevelClasses = (risk: string) => {
  switch (risk) {
    case 'Low Risk': return 'bg-green-100 text-green-700';
    case 'Medium Risk': return 'bg-yellow-100 text-yellow-700';
    case 'High Risk': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Helper function to get Tailwind classes for performance status buttons
const getPerformanceStatusClasses = (status: string) => {
  switch (status) {
    case 'Performing Well': return 'bg-green-50 text-green-700 border border-green-200';
    case 'Review Required': return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'Exit Opportunity': return 'bg-purple-50 text-purple-700 border border-purple-200';
    default: return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  companyName,
  companySector,
  investmentStage,
  riskLevel,
  status,
  investedDate,
  initialInvestment,
  currentValue,
  ownership,
  roi,
  lastRound,
  nextMilestone,
  gainLoss,
  performanceStatus,
  performanceColor,
}) => {
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);

  const handlePerformanceClick = () => {
    setShowPerformanceDetails(true);
  };

  const handleClosePerformance = () => {
    setShowPerformanceDetails(false);
  };

  const handleActionClick = (action: string) => {
    // In a real app, these would trigger specific actions
    switch (action) {
      case 'schedule_review':
        alert(`Scheduling review meeting for ${companyName}. This would open a calendar in a real app.`);
        break;
      case 'request_update':
        alert(`Requesting update from ${companyName}. This would send a notification in a real app.`);
        break;
      case 'explore_exit':
        alert(`Exploring exit options for ${companyName}. This would open exit strategy tools in a real app.`);
        break;
      case 'view_metrics':
        alert(`Opening detailed metrics for ${companyName}. This would show performance analytics in a real app.`);
        break;
      default:
        break;
    }
    setShowPerformanceDetails(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        {/* Top Section: Company Info and Status Tags */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <MdOutlineAssessment className="text-blue-600 text-3xl" /> {/* Company Icon */}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{companyName}</h2>
              <p className="text-gray-600">{companySector}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {investmentStage}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getRiskLevelClasses(riskLevel)}`}>
                  {riskLevel}
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2 flex items-center">
                <FaCalendarAlt className="mr-1" /> Invested {investedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Investment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-700 mt-6 pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium">Initial Investment</p>
            <p className="text-lg font-semibold text-gray-900">{initialInvestment}</p>
          </div>
          <div>
            <p className="text-sm font-medium">ROI</p>
            <p className={`text-lg font-semibold ${roi.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
              <FaChartLine className="inline-block mr-1 text-xl" /> {roi}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Value Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              {/* Placeholder for progress bar - dynamic width needed based on gain/loss */}
              <div className={`h-2.5 rounded-full ${performanceColor === 'green' ? 'bg-green-500' : performanceColor === 'orange' ? 'bg-orange-500' : 'bg-purple-500'}`} style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-gray-700">{gainLoss}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Current Value</p>
            <p className="text-lg font-semibold text-gray-900">{currentValue}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Round</p>
            <p className="text-lg font-semibold text-gray-900">{lastRound}</p>
          </div>
          <div className="flex items-center justify-end">
            <button 
              onClick={handlePerformanceClick}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center cursor-pointer hover:scale-105 transition-all ${getPerformanceStatusClasses(performanceStatus)}`}
            >
              {performanceStatus === 'Performing Well' && <FaChartLine className="mr-2" />}
              {performanceStatus === 'Review Required' && <MdOutlineAssessment className="mr-2" />}
              {performanceStatus === 'Exit Opportunity' && <FaExternalLinkAlt className="mr-2" />}
              {performanceStatus}
            </button>
          </div>

          <div>
            <p className="text-sm font-medium">Ownership</p>
            <p className="text-lg font-semibold text-gray-900">{ownership}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Next Milestone</p>
            <p className="text-lg font-semibold text-gray-900">{nextMilestone}</p>
          </div>
        </div>
      </div>

      {/* Performance Details Modal */}
      {showPerformanceDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Performance Details - {companyName}</h2>
                <button
                  onClick={handleClosePerformance}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status: {performanceStatus}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPerformanceStatusClasses(performanceStatus)}`}>
                  {performanceStatus}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Initial Investment:</span>
                      <span className="text-gray-700">{initialInvestment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Current Value:</span>
                      <span className="text-gray-700">{currentValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ROI:</span>
                      <span className={`font-semibold ${roi.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                        {roi}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Gain/Loss:</span>
                      <span className="font-semibold">{gainLoss}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Sector:</span>
                      <span className="text-gray-700">{companySector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stage:</span>
                      <span className="text-gray-700">{investmentStage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ownership:</span>
                      <span className="text-gray-700">{ownership}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Next Milestone:</span>
                      <span className="text-gray-700">{nextMilestone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {performanceStatus === 'Performing Well' && (
                    <>
                      <button
                        onClick={() => handleActionClick('view_metrics')}
                        className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                      >
                        <FaChartLine className="inline-block mr-2" />
                        View Detailed Metrics
                      </button>
                      <button
                        onClick={() => handleActionClick('request_update')}
                        className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                      >
                        <MdOutlineAssessment className="inline-block mr-2" />
                        Request Update
                      </button>
                    </>
                  )}
                  {performanceStatus === 'Review Required' && (
                    <>
                      <button
                        onClick={() => handleActionClick('schedule_review')}
                        className="p-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
                      >
                        <FaCalendarAlt className="inline-block mr-2" />
                        Schedule Review Meeting
                      </button>
                      <button
                        onClick={() => handleActionClick('request_update')}
                        className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                      >
                        <MdOutlineAssessment className="inline-block mr-2" />
                        Request Detailed Report
                      </button>
                    </>
                  )}
                  {performanceStatus === 'Exit Opportunity' && (
                    <>
                      <button
                        onClick={() => handleActionClick('explore_exit')}
                        className="p-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                      >
                        <FaExternalLinkAlt className="inline-block mr-2" />
                        Explore Exit Options
                      </button>
                      <button
                        onClick={() => handleActionClick('view_metrics')}
                        className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                      >
                        <FaChartLine className="inline-block mr-2" />
                        View Exit Metrics
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={handleClosePerformance}
                  className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentCard;
