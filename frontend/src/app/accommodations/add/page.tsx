'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { getCurrentUserItsId } from '@/lib/permissions';
import { MiqaatApi, MumineenApi, AccommodationApi } from '@/lib/api';

// Define interfaces for our data structures
interface Miqaat {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

interface Mumineen {
  its_id: string;
  name: string;
  full_name?: string;
}

interface FormData {
  its_id: string;
  mumineen_name: string; // This is required in our form
  miqaat_id: string;
  name: string;
  city: string;
  pincode: string;
  accommodation_type: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
}

export default function AddAccommodationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [miqaats, setMiqaats] = useState<Miqaat[]>([]);
  const [mumineen, setMumineen] = useState<Mumineen[]>([]);
  // Removed unused isSearching state
  const [accommodationTypes] = useState([
    'Guest House', 'Hotel', 'Madrasa', 'Home Stay', 'Community Center'
  ]);
  
  // Fetch mumineen data using ITS ID
  const fetchMumineenData = async (itsId: string) => {
    if (!itsId) return;
    
    // Searching functionality removed
    setFormData(prev => ({
      ...prev,
      its_id: itsId // Set ITS ID immediately
    }));
    
    try {
      // Try to fetch from API
      const response = await MumineenApi.getById(itsId);
      if (response.status === 'success' && response.data) {
        // Auto-populate name from API response
        const person = response.data;
        setFormData(prev => ({
          ...prev,
          its_id: person.its_id,
          mumineen_name: person.full_name || person.name || ''
        }));
      } else {
        // Fallback to mock data
        const results = mumineen.filter(person => 
          person.its_id.toLowerCase() === itsId.toLowerCase()
        );
        if (results.length > 0) {
          setFormData(prev => ({
            ...prev,
            its_id: results[0].its_id,
            mumineen_name: results[0].name || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching mumineen data:', error);
      // Fallback to mock data
      const results = mumineen.filter(person => 
        person.its_id.toLowerCase() === itsId.toLowerCase()
      );
      if (results.length > 0) {
        setFormData(prev => ({
          ...prev,
          its_id: results[0].its_id,
          mumineen_name: results[0].name || ''
        }));
      }
    } finally {
      // Searching functionality removed
    }
  };
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    its_id: '',
    mumineen_name: '',
    miqaat_id: '',
    name: '',
    city: 'Colombo',
    pincode: '00100',
    accommodation_type: '',
    room_number: '',
    check_in_date: '',
    check_out_date: '',
  });

  // For API integration fallback
  const mockedMiqaats: Miqaat[] = [
    { id: 1, name: 'Milad Imam uz Zaman', start_date: '2025-06-15', end_date: '2025-06-15' },
    { id: 2, name: 'Eid ul Adha', start_date: '2025-06-25', end_date: '2025-06-26' },
    { id: 3, name: 'Ashara Mubaraka', start_date: '2025-08-08', end_date: '2025-08-17' }
  ];
  
  const mockedMumineen: Mumineen[] = [
    { its_id: 'ITS1234567', name: 'Ahmed Qutbuddin' },
    { its_id: 'ITS7654321', name: 'Fatima Qutbuddin' },
    { its_id: 'ITS2468013', name: 'Taher Saifuddin' },
    { its_id: 'ITS1357924', name: 'Khadija Saifuddin' },
    { its_id: 'ITS9876543', name: 'Hussain Burhani' },
    { its_id: 'ITS8642097', name: 'Maryam Najmuddin' },
    { its_id: 'ITS3690147', name: 'Zainab Akbarali' }
  ];

  useEffect(() => {
    // Auto-populate from local storage
    const itsId = getCurrentUserItsId();
    if (itsId) {
      fetchMumineenData(itsId);
    }
    
    // Fetch miqaats from API and select the first active one
    const fetchMiqaats = async () => {
      try {
        const response = await MiqaatApi.getAll();
        let miqaatsList = [];
        
        if (response.status === 'success' && response.data) {
          miqaatsList = response.data;
        } else {
          // Fallback to mock data if API fails
          console.warn('Using mock miqaat data due to API error');
          miqaatsList = mockedMiqaats;
        }
        
        setMiqaats(miqaatsList);
        
        // Auto-select first active miqaat (miqaat that includes current date)
        const today = new Date();
          
        // Try to find a miqaat that includes today's date
        const activeMiqaat = miqaatsList.find(miqaat => {
          const startDate = new Date(miqaat.start_date);
          const endDate = new Date(miqaat.end_date);
          return startDate <= today && endDate >= today;
        });
          
        // If no active miqaat found, select the first upcoming one
        const selectedMiqaat = activeMiqaat || miqaatsList[0];
          
        // Set the selected miqaat and dates
        setFormData(prev => ({
          ...prev,
          miqaat_id: selectedMiqaat.id.toString(),
          check_in_date: selectedMiqaat.start_date,
          check_out_date: selectedMiqaat.end_date
        }));
      } catch (error) {
        console.error('Error fetching miqaats:', error);
        setMiqaats(mockedMiqaats);
      }
    };

    fetchMiqaats();
    setMumineen(mockedMumineen); // Still using mock mumineen data until API is ready
  }, [fetchMumineenData, mockedMiqaats, mockedMumineen]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto set check-in/out dates based on miqaat selection
    if (name === 'miqaat_id' && value) {
      const selectedMiqaat = miqaats.find((m: Miqaat) => m.id === parseInt(value));
      if (selectedMiqaat) {
        setFormData(prev => ({
          ...prev,
          miqaat_id: value,
          check_in_date: selectedMiqaat.start_date,
          check_out_date: selectedMiqaat.end_date
        }));
      }
    }
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Form data to submit:', formData);
    
    try {
      // Submit to API
      const response = await AccommodationApi.create(formData);
      if (response.status === 'success') {
        router.push('/accommodations');
      } else {
        alert('Error saving accommodation: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting accommodation:', error);
      alert('Failed to save accommodation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/accommodations" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-green-800">Add Accommodation</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mumineen Details Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mumineen Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ITS ID (Auto-populated)</label>
                  <input
                    type="text"
                    name="its_id"
                    value={formData.its_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mumineen Name (Auto-populated)</label>
                  <input
                    type="text"
                    name="mumineen_name"
                    value={formData.mumineen_name}
                    onChange={handleChange}
                    readOnly
                    className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />
          
          {/* Miqaat Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Miqaat Details</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Miqaat</label>
              <select
                name="miqaat_id"
                value={formData.miqaat_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="">Select a miqaat</option>
                {miqaats.map((miqaat) => (
                  <option key={miqaat.id} value={miqaat.id}>
                    {miqaat.name} ({miqaat.start_date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-200" />
          
          {/* Accommodation Details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Accommodation Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Saifee Guest House"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                <select
                  name="accommodation_type"
                  value={formData.accommodation_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a type</option>
                  {accommodationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room/Hall Number</label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  placeholder="e.g. 101 or Hall A"
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
            </div>
          </div>
          
          <hr className="border-gray-200" />
          
          {/* Dates */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stay Duration</h2>
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
          
          {/* Form Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/accommodations" className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 min-w-[120px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : 'Add Accommodation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
