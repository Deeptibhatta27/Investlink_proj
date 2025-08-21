// app/components/OpportunityCard.tsx
"use client";

import React, { useState } from 'react';
import { FaDollarSign, FaChartLine, FaSeedling, FaTag, FaBuilding, FaTimes } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

interface OpportunityCardProps {
  companyName: string;
  industry: string;
  stage: string;
  minInvestment: string;
  valuationCap: string;
  location: string;
  description: string;
  traction: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-green-100 text-green-700';
    case 'Closing Soon': return 'bg-yellow-100 text-yellow-700';
    case 'Closed': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  companyName,
  industry,
  stage,
  minInvestment,
  valuationCap,
  location,
  description,
  traction,
  status,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleInvestNow = () => {
    // In a real app, this would open an investment form or redirect to investment page
    alert(`Investment form for ${companyName} would open here. This is a mock implementation.`);
    setShowDetails(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-transform transform hover:scale-105 duration-300 flex flex-col">
        {/* Top Section: Company Info and Min Investment */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{companyName}</h2>
            <p className="text-gray-600 flex items-center mb-2">
              <FaBuilding className="mr-2 text-md text-gray-500" /> {industry}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center">
                <FaSeedling className="mr-1" /> {stage}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusClasses(status)} flex items-center`}>
                <FaTag className="mr-1" /> {status}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-gray-500">Min. Investment</p>
            <p className="text-xl font-bold text-blue-600">{minInvestment}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">{description}</p>

        {/* Details Section: Valuation, Location, Traction */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-y-3 text-gray-700 mb-4">
          <div className="flex items-start">
            <FaDollarSign className="mr-2 text-lg text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold">Valuation Cap:</span> <span className="block sm:inline">{valuationCap}</span>
            </div>
          </div>
          <div className="flex items-start">
            <MdLocationOn className="mr-2 text-lg text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold">Location:</span> <span className="block sm:inline">{location}</span>
            </div>
          </div>
          <div className="flex items-start">
            <FaChartLine className="mr-2 text-lg text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <span className="font-semibold">Traction:</span> <span className="block sm:inline">{traction}</span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="text-right mt-auto">
          <button 
            onClick={handleViewDetails}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full text-sm shadow-md transition-all"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{companyName}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaBuilding className="mr-3 text-gray-500" />
                      <span className="font-medium">Industry:</span>
                      <span className="ml-2 text-gray-700">{industry}</span>
                    </div>
                    <div className="flex items-center">
                      <FaSeedling className="mr-3 text-gray-500" />
                      <span className="font-medium">Stage:</span>
                      <span className="ml-2 text-gray-700">{stage}</span>
                    </div>
                    <div className="flex items-center">
                      <MdLocationOn className="mr-3 text-gray-500" />
                      <span className="font-medium">Location:</span>
                      <span className="ml-2 text-gray-700">{location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-3 text-gray-500" />
                      <span className="font-medium">Min Investment:</span>
                      <span className="ml-2 text-blue-600 font-bold">{minInvestment}</span>
                    </div>
                    <div className="flex items-center">
                      <FaChartLine className="mr-3 text-gray-500" />
                      <span className="font-medium">Valuation Cap:</span>
                      <span className="ml-2 text-gray-700">{valuationCap}</span>
                    </div>
                    <div className="flex items-center">
                      <FaTag className="mr-3 text-gray-500" />
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${getStatusClasses(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Traction & Milestones</h3>
                <p className="text-gray-700 leading-relaxed">{traction}</p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleInvestNow}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpportunityCard;

