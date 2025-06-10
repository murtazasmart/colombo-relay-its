'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  MapPinIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { AccommodationApi, MiqaatApi, MumineenApi } from '@/lib/api';

// Define interfaces for type safety
interface Miqaat {
  id: number;
  name: string;
}

interface Mumineen {
  its_id: string;
  eits_id?: string;
  hof_its_id: string | null;
  full_name: string;
  name?: string;
  gender?: 'male' | 'female';
  age?: number;
  mobile?: string;
  country?: string;
}

interface Accommodation {
  id: number;
  its_id: string;
  mumineen_name: string;
  miqaat_id: number;
  miqaat_name: string;
  name: string;
  city: string;
  accommodation_type: string;
  check_in_date: string;
  check_out_date: string;
  room_number?: string;
  status: string;
}

// Group type for family members
interface FamilyGroup {
  hof: Mumineen;
  members: Mumineen[];
  accommodations: Accommodation[];
}

export default function AccommodationsPage() {
  // State for accommodation data
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [miqaats, setMiqaats] = useState<Miqaat[]>([]);
  const [selectedMiqaat, setSelectedMiqaat] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for family-based approach
  const [hofList, setHofList] = useState<Mumineen[]>([]);
  const [familyGroups, setFamilyGroups] = useState<Map<string, FamilyGroup>>(new Map());
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set());
  
  // Toggle family expansion
  const toggleFamilyExpansion = (hofItsId: string) => {
    setExpandedFamilies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hofItsId)) {
        newSet.delete(hofItsId);
      } else {
        newSet.add(hofItsId);
        // Load family details if not already loaded
        if (!familyGroups.has(hofItsId)) {
          loadFamilyDetails(hofItsId);
        }
      }
      return newSet;
    });
  };
  
  // Load family details including members and their accommodations
  const loadFamilyDetails = async (hofItsId: string) => {
    try {
      // Fetch family members
      const familyResponse = await MumineenApi.getFamilyByHofIts(hofItsId);
      if (familyResponse.status === 'success' && Array.isArray(familyResponse.data)) {
        // Fetch accommodations for all family members
        const accomResponse = await AccommodationApi.getByHofIts(hofItsId);
        
        // Find the HoF from the list
        const hof = hofList.find(h => h.its_id === hofItsId) || {
          its_id: hofItsId,
          full_name: 'Unknown',
          hof_its_id: null
        };
        
        // Update family groups
        setFamilyGroups(prev => {
          const newMap = new Map(prev);
          newMap.set(hofItsId, {
            hof,
            members: familyResponse.data || [],
            accommodations: accomResponse.status === 'success' && Array.isArray(accomResponse.data) ? 
              accomResponse.data as Accommodation[] : []
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error(`Error loading family details for ${hofItsId}:`, error);
    }
  };
  
  // Filter functions for accommodations search
  const filterAccommodations = () => {
    return accommodations.filter(accommodation => {
      // Filter by miqaat
      if (selectedMiqaat !== 'all' && accommodation.miqaat_id !== parseInt(selectedMiqaat)) {
        return false;
      }
      
      // Filter by type
      if (selectedType !== 'all' && accommodation.accommodation_type !== selectedType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !accommodation.its_id.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !accommodation.mumineen_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !accommodation.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !accommodation.city.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Filter HoFs based on search query
  const filterHofs = () => {
    if (!searchQuery) return hofList;
    
    return hofList.filter(hof => 
      hof.its_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hof.full_name && hof.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hof.name && hof.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch miqaats
        const miqaatResponse = await MiqaatApi.getAll();
        if (miqaatResponse.status === 'success' && Array.isArray(miqaatResponse.data)) {
          setMiqaats(miqaatResponse.data);
        }
        
        // Get current user's ITS from local storage
        const userItsId = localStorage.getItem('its_no');
        if (userItsId) {
          // Find HOF ITS ID for current user
          const hofResponse = await MumineenApi.getHofByIts(userItsId);
          if (hofResponse.status === 'success' && hofResponse.data) {
            const { hof_its_id, is_hof } = hofResponse.data;
            
            // Load all HOFs for dropdown/search purposes
            const allHofsResponse = await MumineenApi.getAllHofs();
            if (allHofsResponse.status === 'success' && Array.isArray(allHofsResponse.data)) {
              setHofList(allHofsResponse.data);
            }
            
            // Auto-expand the current user's family details
            if (hof_its_id) {
              setExpandedFamilies(new Set([hof_its_id]));
              await loadFamilyDetails(hof_its_id);
            }
          }
        } else {
          // No user ITS in storage, load all HOFs normally
          const hofResponse = await MumineenApi.getAllHofs();
          if (hofResponse.status === 'success' && Array.isArray(hofResponse.data)) {
            setHofList(hofResponse.data);
          }
        }
        
        // Fetch all accommodations (for statistics and filtering)
        const accomResponse = await AccommodationApi.getAll();
        if (accomResponse.status === 'success' && Array.isArray(accomResponse.data)) {
          // Use type assertion to ensure compatibility
          setAccommodations(accomResponse.data as Accommodation[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get unique accommodation types
  const accommodationTypes = [...new Set(accommodations.map(a => a.accommodation_type))];

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Accommodations</h1>
        <Link href="/accommodations/add" className="btn-primary flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Accommodation
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ITS ID, name, or location"
                className="w-full px-4 py-2 border rounded-md pl-10"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Miqaat</label>
            <select 
              value={selectedMiqaat}
              onChange={(e) => setSelectedMiqaat(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="all">All Miqaats</option>
              {miqaats.map(miqaat => (
                <option key={miqaat.id} value={miqaat.id}>{miqaat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              {accommodationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : (
        <>
          {/* Families and their Accommodations */}
          {hofList.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Families</h2>
              
              {filterHofs().map((hof) => {
                const isExpanded = expandedFamilies.has(hof.its_id);
                const familyGroup = familyGroups.get(hof.its_id);
                
                return (
                  <div key={hof.its_id} className="card overflow-hidden">
                    {/* Family Header - always visible */}
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleFamilyExpansion(hof.its_id)}
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{hof.full_name || hof.name}</h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <span className="font-semibold mr-2">ITS:</span> {hof.its_id}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {/* Show counts of family members and accommodations if available */}
                        {familyGroup && (
                          <div className="flex mr-6 text-sm">
                            <span className="mr-4">
                              <span className="font-semibold">Family Members:</span> {familyGroup.members.length}
                            </span>
                            <span>
                              <span className="font-semibold">Accommodations:</span> {familyGroup.accommodations.length}
                            </span>
                          </div>
                        )}
                        
                        <button className="text-blue-600 hover:text-blue-800">
                          {isExpanded ? 'Hide Details' : 'Show Details'}
                        </button>
                        
                        <Link href={`/accommodations/add?hof=${hof.its_id}`} className="ml-4 btn-sm btn-primary">
                          <PlusCircleIcon className="h-4 w-4 mr-1" />
                          Book Accommodation
                        </Link>
                      </div>
                    </div>
                    
                    {/* Family Details - visible when expanded */}
                    {isExpanded && familyGroup ? (
                      <div className="border-t">
                        {/* Family Members Section */}
                        <div className="p-4 bg-gray-50">
                          <h4 className="font-medium text-gray-700 mb-2">Family Members</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {familyGroup.members.map((member) => (
                              <div key={member.its_id} className="p-2 bg-white rounded border">
                                <p className="font-medium">{member.full_name || member.name}</p>
                                <p className="text-sm text-gray-500">ITS: {member.its_id}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Accommodations Section */}
                        {familyGroup.accommodations.length > 0 ? (
                          <div className="p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Accommodations</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Family Member
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Room
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Dates
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {familyGroup.accommodations.map((accommodation) => (
                                    <tr key={accommodation.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {accommodation.mumineen_name}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {accommodation.name}, {accommodation.city}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {accommodation.room_number || '-'}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(accommodation.check_in_date)} - {formatDate(accommodation.check_out_date)}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/accommodations/${accommodation.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                          <PencilSquareIcon className="h-5 w-5 inline-block" />
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-gray-500 mb-2">No accommodations booked for this family</p>
                            <Link href={`/accommodations/add?hof=${hof.its_id}`} className="btn-sm btn-primary inline-flex items-center">
                              <PlusCircleIcon className="h-4 w-4 mr-1" />
                              Book Accommodation
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : isLoading ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500">Loading families...</p>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-gray-500 mb-4">No families found</p>
              <Link href="/accommodations/add" className="btn-primary inline-flex items-center">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Accommodation
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
