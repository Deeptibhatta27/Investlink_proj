// app/components/AddInvestorModal.tsx
"use client";

import React, { useState } from 'react';
import { MdClose, MdPerson, MdBusiness, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

interface AddInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (investor: InvestorData) => void;
}

interface InvestorData {
  name: string;
  type: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  investmentRange: string;
  preferredSectors: string[];
  notes: string;
}

const AddInvestorModal: React.FC<AddInvestorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<InvestorData>({
    name: '',
    type: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    investmentRange: '',
    preferredSectors: [],
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<InvestorData>>({});

  const investorTypes = [
    'Angel Investor',
    'VC Firm',
    'PE Firm',
    'Micro VC',
    'Angel Network',
    'Corporate VC',
    'Family Office',
    'Crowdfunding Platform'
  ];

  const investmentRanges = [
    '$10K - $50K',
    '$50K - $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M+'
  ];

  const sectorOptions = [
    'AI/ML',
    'FinTech',
    'HealthTech',
    'EdTech',
    'CleanTech',
    'AgriTech',
    'E-commerce',
    'SaaS',
    'Biotech',
    'Cybersecurity',
    'IoT',
    'Blockchain'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof InvestorData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSectorChange = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter(s => s !== sector)
        : [...prev.preferredSectors, sector]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InvestorData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Investor type is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd(formData);
      // Reset form
      setFormData({
        name: '',
        type: '',
        email: '',
        phone: '',
        company: '',
        location: '',
        investmentRange: '',
        preferredSectors: [],
        notes: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      investmentRange: '',
      preferredSectors: [],
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Investor</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose className="text-2xl text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdPerson className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter investor's full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdBusiness className="inline mr-2" />
                Investor Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select investor type</option>
                {investorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdEmail className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="investor@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdBusiness className="inline mr-2" />
                Company/Organization *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdLocationOn className="inline mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, State/Country"
              />
            </div>
          </div>

          {/* Investment Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Range
              </label>
              <select
                name="investmentRange"
                value={formData.investmentRange}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select investment range</option>
                {investmentRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Sectors
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                <div className="grid grid-cols-2 gap-2">
                  {sectorOptions.map(sector => (
                    <label key={sector} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.preferredSectors.includes(sector)}
                        onChange={() => handleSectorChange(sector)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information about this investor..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Investor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestorModal;
