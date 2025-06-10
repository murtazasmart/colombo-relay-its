'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Define interface for Accommodation data structure
interface Accommodation {
  id: number;
  its_id: string;
  mumineen_name: string;
  miqaat_id: number;
  miqaat_name: string;
  name: string;
  city: string;
  pincode: string;
  accommodation_type: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  room_number: string;
}

export default function AccommodationDetailsPage() {
  const params = useParams();
  // Remove unused router
  const id = params.id;
  
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    pincode: '',
    accommodation_type: '',
    room_number: '',
    check_in_date: '',
    check_out_date: ''
  });


  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setIsLoading(true);
        // Use the proper API client to fetch accommodation data
        const response = await fetch(`http://127.0.0.1:8000/api/accommodations/${id}`);
        const data = await response.json();
        
        if (data) {
          setAccommodation(data);
          setFormData({
            name: data.name || '',
            city: data.city || '',
            pincode: data.pincode || '',
            accommodation_type: data.accommodation_type || '',
            room_number: data.room_number || '',
            check_in_date: data.check_in_date || '',
            check_out_date: data.check_out_date || ''
          });
        } else {
          console.error('Accommodation not found');
        }
      } catch (error) {
        console.error('Error fetching accommodation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && accommodation) {
      // In a real app, send PUT request to API
      const updatedAccommodation = {
        ...accommodation,
        ...formData
      } as Accommodation;
      
      console.log('Updating accommodation with data:', updatedAccommodation);
      
      // For demo, simulate API call
      setIsLoading(true);
      setTimeout(() => {
        setAccommodation(updatedAccommodation);
        setIsLoading(false);
        setIsEditing(false);
      }, 500);
      
      // In a real implementation:
      // fetch(`/api/accommodations/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedAccommodation),
      // })
      //   .then(res => res.json())
      //   .then(data => {
      //     setAccommodation(data);
      //     setIsLoading(false);
      //     setIsEditing(false);
      //   });
    }
  };

  if (isLoading && !accommodation) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Accommodation not found</h2>
        <Link href="/accommodations" className="mt-4 inline-block btn-primary">
          Return to Accommodations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/accommodations" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-green-800">
          {isEditing ? 'Edit Accommodation' : 'Accommodation Details'}
        </h1>
        <div className="ml-auto">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Details
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mumineen Details (Read-only) */}
              <div>
                <h3 className="text-lg font-medium mb-4">Mumineen Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ITS ID</label>
                    <input
                      type="text"
                      value={accommodation.its_id}
                      readOnly
                      className="w-full px-4 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={accommodation.mumineen_name}
                      readOnly
                      className="w-full px-4 py-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miqaat</label>
                  <input
                    type="text"
                    value={accommodation.miqaat_name}
                    readOnly
                    className="w-full px-4 py-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
              
              {/* Accommodation Details (Editable) */}
              <div>
                <h3 className="text-lg font-medium mb-4">Accommodation Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room/Hall</label>
                    <input
                      type="text"
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dates */}
            <div>
              <h3 className="text-lg font-medium mb-4">Stay Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    name="check_in_date"
                    value={formData.check_in_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    name="check_out_date"
                    value={formData.check_out_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="btn-primary min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : 'Update Accommodation'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mumineen Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Mumineen Information</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ITS ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.its_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.mumineen_name}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Miqaat</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.miqaat_name}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Accommodation Details */}
              <div>
                <h3 className="text-lg font-medium mb-4">Accommodation Details</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Room/Hall</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.room_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.accommodation_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                    <dd className="mt-1 text-sm text-gray-900">{accommodation.pincode || '—'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Stay Duration */}
            <div>
              <h3 className="text-lg font-medium mb-4">Stay Duration</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Check-in Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(accommodation.check_in_date).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Check-out Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(accommodation.check_out_date).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Status */}
            <div className="pt-4 border-t border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  accommodation.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {accommodation.status}
                </span>
              </dd>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
