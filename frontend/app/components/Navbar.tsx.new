'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handlePortalEntry = (type: 'investor' | 'startup') => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/${type}/dashboard`);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4 items-center">
            {!user ? (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-primary hover:text-primary-dark"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-700">Welcome, {user.email}!</p>
                <button
                  onClick={() => handlePortalEntry('investor')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Investor Portal
                </button>
                <button
                  onClick={() => handlePortalEntry('startup')}
                  className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark"
                >
                  Startup Portal
                </button>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
