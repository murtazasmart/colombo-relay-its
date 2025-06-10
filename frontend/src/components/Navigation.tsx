'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  QrCodeIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Census Management', href: '/census', icon: UserGroupIcon },
    { name: 'Miqaat Management', href: '/miqaats', icon: CalendarIcon },
    { name: 'Arrival Scans', href: '/scans', icon: QrCodeIcon },
    { name: 'Accommodations', href: '/accommodations', icon: BuildingOfficeIcon },
  ];

  return (
    <aside className={`bg-gradient-to-b from-green-800 to-green-900 text-white ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col h-full`}>
      <div className="p-4 flex items-center justify-between border-b border-green-700">
        {!collapsed && (
          <div className="font-bold text-xl text-yellow-500">Colombo ITS</div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-full hover:bg-green-700"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.22 14.78a.75.75 0 001.06 0l4.25-4.25a.75.75 0 000-1.06L8.28 5.22a.75.75 0 00-1.06 1.06L10.94 10l-3.72 3.72a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-gray-300 hover:bg-green-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-green-700 flex items-center">
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-green-900 font-bold">
              A
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-gray-300">admin@example.com</div>
            </div>
          </>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-green-900 font-bold">
            A
          </div>
        )}
      </div>
    </aside>
  );
};

export default Navigation;
