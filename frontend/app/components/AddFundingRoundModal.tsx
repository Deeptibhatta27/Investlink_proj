// app/components/AddFundingRoundModal.tsx
"use client";

import React, { useState } from 'react';
import { MdClose, MdAttachMoney, MdCalendarToday, MdBusiness, MdDescription } from 'react-icons/md';

interface AddFundingRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (fundingRound: FundingRoundData) => void;
}

interface FundingRoundData {
  title: string;
  type: string;
  targetAmount: string;
  raisedAmount: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  useOfFunds: string;
  milestones: string[];
}

const AddFundingRoundModal: React.FC<AddFundingRoundModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<FundingRoundData>({
    title: '',
    type: '',
    targetAmount: '',
    raisedAmount: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    description: '',
    useOfFunds: '',
    milestones: []
  });

  const [errors, setErrors] = useState<Partial<FundingRoundData>>({});
  const [newMilestone, setNewMilestone] = useState('');

  const fundingTypes = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
    'Bridge Round',
    'Convertible Note',
    'SAFE',
    'Revenue-Based Financing'
  ];

  const statusOptions = [
    'Planning',
    'Active',
    'Closing',
    'Completed',
    'On Hold',
    'Cancelled'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FundingRoundData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addMilestone = () => {
    if (newMilestone.trim() && !formData.milestones.includes(newMilestone.trim())) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone.trim()]
      }));
      setNewMilestone('');
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FundingRoundData> = {};

    if (!formData.title.trim()) newErrors.title = 'Round title is required';
    if (!formData.type) newErrors.type = 'Funding type is required';
    if (!formData.targetAmount) newErrors.targetAmount = 'Target amount is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.status) newErrors.status = 'Status is required';

    // Validate amounts
    if (formData.targetAmount && isNaN(Number(formData.targetAmount.replace(/[$,]/g, '')))) {
      newErrors.targetAmount = 'Please enter a valid amount';
    }
    if (formData.raisedAmount && isNaN(Number(formData.raisedAmount.replace(/[$,]/g, '')))) {
      newErrors.raisedAmount = 'Please enter a valid amount';
    }

    // Validate dates
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
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
        title: '',
        type: '',
        targetAmount: '',
        raisedAmount: '',
        startDate: '',
        endDate: '',
        status: 'Planning',
        description: '',
        useOfFunds: '',
        milestones: []
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      targetAmount: '',
      raisedAmount: '',
      startDate: '',
      endDate: '',
      status: 'Planning',
      description: '',
      useOfFunds: '',
      milestones: []
    });
    setErrors({});
    setNewMilestone('');
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue === '') return '';
    
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format as currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Funding Round</h2>
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
                <MdDescription className="inline mr-2" />
                Round Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Series A, Seed Round"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdBusiness className="inline mr-2" />
                Funding Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select funding type</option>
                {fundingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdAttachMoney className="inline mr-2" />
                Target Amount *
              </label>
              <input
                type="text"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setFormData(prev => ({ ...prev, targetAmount: formatted }));
                }}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.targetAmount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="$500,000"
              />
              {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdAttachMoney className="inline mr-2" />
                Amount Raised (Optional)
              </label>
              <input
                type="text"
                name="raisedAmount"
                value={formData.raisedAmount}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setFormData(prev => ({ ...prev, raisedAmount: formatted }));
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$0"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdCalendarToday className="inline mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdCalendarToday className="inline mr-2" />
                End Date (Optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Round Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the purpose and goals of this funding round..."
            />
          </div>

          {/* Use of Funds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use of Funds
            </label>
            <textarea
              name="useOfFunds"
              value={formData.useOfFunds}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How will the funds be used? (e.g., product development, marketing, hiring, etc.)"
            />
          </div>

          {/* Milestones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Milestones
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                />
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.milestones.length > 0 && (
                <div className="space-y-2">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{milestone}</span>
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <MdClose className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              Create Funding Round
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundingRoundModal;
