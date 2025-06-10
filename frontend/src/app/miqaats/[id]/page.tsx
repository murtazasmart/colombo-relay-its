'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  UserGroupIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';

export default function MiqaatDetailsPage() {
  const params = useParams();
  const id = params.id;
  
  const [miqaat, setMiqaat] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mocked data for this example
  const mockedMiqaats = [
    {
      id: 1,
      name: 'Milad Imam uz Zaman',
      description: 'Milad celebration of Imam uz Zaman TUS with special programs throughout the day including khususi and aam majlis.',
      start_date: '2025-06-15',
      end_date: '2025-06-15',
      location: 'Main Hall, Colombo',
      status: 'upcoming',
      events: [
        { id: 101, name: 'Milad Khususi Majlis', datetime: '2025-06-15T09:00:00', location: 'Main Hall', description: 'Special majlis for invited guests only' },
        { id: 102, name: 'Milad Aam Majlis', datetime: '2025-06-15T16:00:00', location: 'Main Hall', description: 'Public majlis open to all mumineen' }
      ],
      registrations: [
        { id: 1001, its_id: 'ITS1234567', name: 'Ahmed Qutbuddin', accommodation: 'None', status: 'confirmed' },
        { id: 1002, its_id: 'ITS7654321', name: 'Fatima Qutbuddin', accommodation: 'None', status: 'confirmed' },
        { id: 1003, its_id: 'ITS2468013', name: 'Taher Saifuddin', accommodation: 'Room 101', status: 'confirmed' },
        { id: 1004, its_id: 'ITS1357924', name: 'Khadija Saifuddin', accommodation: 'Room 101', status: 'confirmed' },
        { id: 1005, its_id: 'ITS9876543', name: 'Hussain Burhani', accommodation: 'None', status: 'pending' }
      ],
      registration_count: 358,
      coordinator: 'Abdul Qadir Hakimuddin',
      contact: '+94712345678'
    },
    // Other miqaats would be here but removed for brevity
  ];

  useEffect(() => {
    // In a real app, fetch from API:
    // fetch(`/api/miqaats/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setMiqaat(data);
    //     setIsLoading(false);
    //   })
    
    // Mock data for now
    setTimeout(() => {
      const foundMiqaat = mockedMiqaats.find(m => m.id === parseInt(id));
      setMiqaat(foundMiqaat || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!miqaat) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Miqaat not found</h2>
        <p className="mt-2 text-gray-500">The miqaat you are looking for does not exist or has been removed.</p>
        <Link href="/miqaats" className="mt-4 inline-block btn-primary">
          Return to Miqaat List
        </Link>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/miqaats" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-green-800">{miqaat.name}</h1>
        <div className="ml-auto">
          <Link href={`/miqaats/${id}/edit`} className="btn-outline flex items-center">
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Edit Miqaat
          </Link>
        </div>
      </div>

      {/* Miqaat Overview Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">About this Miqaat</h2>
            <p className="text-gray-700 mb-4">{miqaat.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarDaysIcon className="h-5 w-5 text-green-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {miqaat.start_date === miqaat.end_date 
                        ? formatDate(miqaat.start_date)
                        : `${formatDate(miqaat.start_date)} - ${formatDate(miqaat.end_date)}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-green-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{miqaat.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <UserGroupIcon className="h-5 w-5 text-green-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Registrations</p>
                    <p className="font-medium">{miqaat.registration_count}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <UserGroupIcon className="h-5 w-5 text-green-700 mt-0.5 mr-2" /> 
                  <div>
                    <p className="text-sm text-gray-500">Coordinator</p>
                    <p className="font-medium">{miqaat.coordinator}</p>
                    <p className="text-sm text-gray-500">{miqaat.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Quick Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={`/miqaats/${id}/register`} className="btn-primary w-full justify-center flex items-center">
                Register Mumineen
              </Link>
              <Link href={`/miqaats/${id}/events/add`} className="btn-outline w-full justify-center flex items-center">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Event
              </Link>
              <Link href={`/miqaats/${id}/scan`} className="btn-outline w-full justify-center flex items-center">
                Scan Arrival
              </Link>
              <Link href={`/miqaats/${id}/report`} className="btn-outline w-full justify-center flex items-center">
                Generate Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Events ({miqaat.events.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registrations'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Registrations ({miqaat.registrations.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 card">
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {miqaat.events.map((event) => (
                  <div key={event.id} className="flex border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex-shrink-0 bg-green-50 text-green-700 p-3 rounded-lg">
                      <ClockIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formatDateTime(event.datetime)} at {event.location}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Registration Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Registrations</span>
                  <span className="font-semibold">{miqaat.registration_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-semibold">{miqaat.registrations.filter(r => r.status === 'confirmed').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold">{miqaat.registrations.filter(r => r.status === 'pending').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">With Accommodation</span>
                  <span className="font-semibold">{miqaat.registrations.filter(r => r.accommodation !== 'None').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="card overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Events</h3>
              <Link href={`/miqaats/${id}/events/add`} className="btn-outline text-sm">
                <PlusCircleIcon className="h-4 w-4 mr-2 inline" />
                Add Event
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {miqaat.events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDateTime(event.datetime)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{event.description}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Link href={`/miqaats/${id}/events/${event.id}/edit`} className="text-green-600 hover:text-green-900">
                          <PencilSquareIcon className="h-5 w-5 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="card overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Registered Mumineen</h3>
              <div className="flex space-x-2">
                <Link href={`/miqaats/${id}/register`} className="btn-outline text-sm">
                  Register More
                </Link>
                <button className="btn-secondary text-sm">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITS ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accommodation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {miqaat.registrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{registration.its_id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{registration.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{registration.accommodation}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          registration.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Link href={`/miqaats/${id}/registrations/${registration.id}`} className="text-green-600 hover:text-green-900 mr-2">
                          View
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
