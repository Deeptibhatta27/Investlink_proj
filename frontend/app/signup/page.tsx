// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Logo from "../components/Logo";
import { FaUserTie, FaRocket, FaExclamationTriangle } from 'react-icons/fa';

// Alert component for displaying messages
const Alert = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  if (!message) return null;

  const baseClasses = "p-4 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2";
  const typeClasses = type === 'success'
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {type === 'error' && <FaExclamationTriangle />}
      <span>{message}</span>
    </div>
  );
};

export default function SignupPage() {
  const router = useRouter();
  const [signupType, setSignupType] = useState<"investor" | "startup">("investor");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // Investor fields
    firstName: "",
    lastName: "",
    investmentFirm: "",
    investmentRange: "",
    preferredSectors: "",
    // Startup fields
    founderName: "",
    startupName: "",
    industrySector: "",
    fundingStage: "",
    companyDescription: "",
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    const dataToSend = {
      username: formData.email,
      password: formData.password,
      email: formData.email,
      role: signupType,
      ...(signupType === 'investor' ? {
        first_name: formData.firstName,
        last_name: formData.lastName,
        investment_firm: formData.investmentFirm,
        investment_range: formData.investmentRange,
        preferred_sectors: formData.preferredSectors,
      } : {
        founder_name: formData.founderName,
        startup_name: formData.startupName,
        industry_sector: formData.industrySector,
        funding_stage: formData.fundingStage,
        company_description: formData.companyDescription,
      })
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const endpoint = signupType === 'investor'
      ? `${apiUrl}/accounts/register/investor/`
      : `${apiUrl}/accounts/register/startup/`;

    console.log('Sending request to:', endpoint);
    console.log('Data being sent:', dataToSend);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.message || 'Signup successful! Redirecting to login...');
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const errorMessage = responseData.email?.[0] || responseData.username?.[0] || responseData.detail || responseData.message || 'Signup failed. Please check your details.';
        setMessage(errorMessage);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Network error: Please check your connection and try again.");
      setIsSuccess(false);
      
      // Additional error logging
      console.log('Full error details:', {
        error,
        endpoint,
        sentData: dataToSend
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-2xl mx-auto my-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join the premier investment platform
          </p>
        </div>

        {/* Alert for messages */}
        <div className="mb-4">
          <Alert message={message} type={isSuccess ? 'success' : 'error'} />
        </div>

        <div className="flex justify-center mb-8 bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setSignupType("investor")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                signupType === "investor"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
          >
            <FaUserTie /> Investor
          </button>
          <button
            type="button"
            onClick={() => setSignupType("startup")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                signupType === "startup"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
          >
            <FaRocket /> Startup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Fields */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Conditional Fields for Investor */}
          {signupType === "investor" && (
            <>
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="investmentFirm" className="block text-sm font-semibold mb-2">
                  Investment Firm
                </label>
                <input
                  type="text"
                  id="investmentFirm"
                  name="investmentFirm"
                  placeholder="e.g., Venture Capital Inc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.investmentFirm}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="investmentRange" className="block text-sm font-semibold mb-2">
                  Investment Range
                </label>
                <input
                  type="text"
                  id="investmentRange"
                  name="investmentRange"
                  placeholder="e.g., $100k - $1M"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.investmentRange}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="preferredSectors" className="block text-sm font-semibold mb-2">
                  Preferred Sectors
                </label>
                <input
                  type="text"
                  id="preferredSectors"
                  name="preferredSectors"
                  placeholder="e.g., AI, Fintech, Healthcare (comma-separated)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.preferredSectors}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Conditional Fields for Startup */}
          {signupType === "startup" && (
            <>
              <div>
                <label htmlFor="founderName" className="block text-sm font-semibold mb-2">
                  Founder Name
                </label>
                <input
                  type="text"
                  id="founderName"
                  name="founderName"
                  placeholder="Enter founder's name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.founderName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="startupName" className="block text-sm font-semibold mb-2">
                  Startup Name
                </label>
                <input
                  type="text"
                  id="startupName"
                  name="startupName"
                  placeholder="Enter startup's name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.startupName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="industrySector" className="block text-sm font-semibold mb-2">
                  Industry Sector
                </label>
                <input
                  type="text"
                  id="industrySector"
                  name="industrySector"
                  placeholder="e.g., SaaS, E-commerce, Biotech"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.industrySector}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="fundingStage" className="block text-sm font-semibold mb-2">
                  Funding Stage
                </label>
                <input
                  type="text"
                  id="fundingStage"
                  name="fundingStage"
                  placeholder="e.g., Seed, Series A, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.fundingStage}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="companyDescription" className="block text-sm font-semibold mb-2">
                  Company Description
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  rows={4}
                  placeholder="Briefly describe your company"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : `Sign Up as ${signupType.charAt(0).toUpperCase() + signupType.slice(1)}`}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}