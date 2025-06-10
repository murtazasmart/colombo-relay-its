'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  CalendarDaysIcon,
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { MiqaatApi } from '@/lib/api';

// Define a TypeScript interface for the Miqaat type
interface Miqaat {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  events: MiqaatEvent[];
  registration_count: number;
}

interface MiqaatEvent {
  id: number;
  name: string;
  datetime: string;
  location: string;
}

export default function MiqaatsPage() {
  const [miqaats, setMiqaats] = useState<Miqaat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch miqaats from API
    const fetchMiqaats = async () => {
      try {
        const response = await MiqaatApi.getAll();
        
        if (response.status === 'success' && response.data) {
          // Process the data to ensure it matches our expected structure
          const formattedMiqaats = response.data.map(miqaat => {
            // Determine if miqaat is upcoming or completed based on end_date
            const today = new Date();
            const endDate = new Date(miqaat.end_date);
            const status = endDate < today ? 'completed' : 'upcoming';
            
            // Ensure events array exists
            const events = miqaat.events || [];
            
            return {
              ...miqaat,
              status,
              events,
              // Provide default values for optional fields
              registration_count: miqaat.registration_count || 0
            };
          });
          
          setMiqaats(formattedMiqaats);
          setError(null);
        } else {
          console.error('API returned error:', response);
          setError('Failed to load miqaats. ' + (response.message || ''));
        }
      } catch (err) {
        console.error('Error fetching miqaats:', err);
        setError('Failed to load miqaats. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMiqaats();
  }, []);

  // Filter to get upcoming and past miqaats
  const upcomingMiqaats = miqaats.filter(miqaat => miqaat.status === 'upcoming');
  const pastMiqaats = miqaats.filter(miqaat => miqaat.status === 'completed');

  // Function to format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    if (startDate === endDate) {
      return formatDate(start);
    } else {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Miqaat Management</h1>
        <Link href="/miqaats/add" className="btn-primary flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Miqaat
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : error ? (
        <div className="card bg-red-50 border border-red-200 p-4">
          <div className="flex items-center text-red-700">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
          <button 
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Re-trigger the useEffect by changing a state
              setTimeout(() => window.location.reload(), 100);
            }}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Upcoming Miqaats */}
          <div className="card">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Upcoming Miqaats</h2>
            <div className="space-y-4">
              {upcomingMiqaats.length > 0 ? (
                upcomingMiqaats.map((miqaat) => (
                  <div key={miqaat.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{miqaat.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{miqaat.description}</p>
                        
                        <div className="mt-3 flex flex-col space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                            {formatDateRange(miqaat.start_date, miqaat.end_date)}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {miqaat.location}
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-2" />
                            {miqaat.registration_count} registrations
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/miqaats/${miqaat.id}/edit`} className="text-green-600 hover:text-green-900">
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        <Link href={`/miqaats/${miqaat.id}`} className="bg-green-50 text-green-700 px-3 py-2 rounded flex items-center text-sm hover:bg-green-100">
                          View Details
                          <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Events */}
                    {miqaat.events.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Events ({miqaat.events.length})</h4>
                        <div className="space-y-2">
                          {miqaat.events.slice(0, 2).map((event) => (
                            <div key={event.id} className="flex items-center text-sm">
                              <ClockIcon className="h-4 w-4 text-green-600 mr-2" />
                              <span className="font-medium mr-2">{event.name}</span>
                              <span className="text-gray-500">
                                {new Date(event.datetime).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                                {' at '}{event.location}
                              </span>
                            </div>
                          ))}
                          {miqaat.events.length > 2 && (
                            <div className="text-sm text-green-600 hover:text-green-800">
                              <Link href={`/miqaats/${miqaat.id}/events`}>
                                + {miqaat.events.length - 2} more events
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4 text-center">No upcoming miqaats found.</p>
              )}
            </div>
          </div>
          
          {/* Past Miqaats */}
          {pastMiqaats.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Past Miqaats</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastMiqaats.map((miqaat) => (
                      <tr key={miqaat.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{miqaat.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDateRange(miqaat.start_date, miqaat.end_date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{miqaat.location}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{miqaat.registration_count}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Link href={`/miqaats/${miqaat.id}`} className="text-green-600 hover:text-green-900">
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
