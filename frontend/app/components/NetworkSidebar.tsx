import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaBriefcase, FaNewspaper, FaBookmark } from 'react-icons/fa';

export default function NetworkSidebar() {
  const menuItems = [
    {
      icon: FaUserCircle,
      label: 'My Profile',
      href: '/profile',
    },
    {
      icon: FaBriefcase,
      label: 'My Network',
      href: '/network',
    },
    {
      icon: FaNewspaper,
      label: 'My Posts',
      href: '/network/my-posts',
    },
    {
      icon: FaBookmark,
      label: 'Saved Items',
      href: '/network/saved',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
      {/* Profile Summary */}
      <div className="text-center mb-6">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="rounded-full overflow-hidden">
            <Image
              src="/images/profile-placeholder.jpg"
              alt="Profile"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">Your Name</h3>
        <p className="text-sm text-gray-500">Your Role • Your Company</p>
      </div>

      {/* Profile Stats */}
      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Profile views</p>
            <p className="text-xl font-semibold text-gray-900">245</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Post impressions</p>
            <p className="text-xl font-semibold text-gray-900">2.4k</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <item.icon className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
