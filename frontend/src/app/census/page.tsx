'use client';

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MumineenApi } from '@/lib/api';

// Define interface for Mumineen data structure based on database schema
interface Mumineen {
  its_id: string;
  eits_id?: string;
  hof_its_id: string | null;
  full_name: string;
  gender?: 'male' | 'female';
  age?: number;
  mobile?: string;
  country?: string;
  role_id?: number;
}

export default function CensusPage() {
  const [mumineen, setMumineen] = useState<Mumineen[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // API pagination params
  const perPage = 10; // Fixed per page value
  const [hasError, setHasError] = useState(false);

  // Fetch mumineen data from API
  const fetchMumineen = async (page = 1, search = '') => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const response = await MumineenApi.getAll({
        page,
        search,
        per_page: perPage
      });
      
      if (response.status === 'success') {
        if (Array.isArray(response.data?.data)) {
          setMumineen(response.data.data as Mumineen[]);
          setTotalPages(response.data.meta?.last_page || 1);
        }
      } else {
        console.error('API returned error:', response);
        setHasError(true);
      }
    } catch (error) {
      console.error('Error fetching mumineen data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on initial load and when search or pagination changes
  useEffect(() => {
    fetchMumineen(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // No client-side filtering needed as the API will handle filtering

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchMumineen(1, searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Census Management</h1>
        <Link href="/census/add" className="btn-primary flex items-center">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Mumineen
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-grow max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ITS ID, Name, or Family ID"
                className="w-full px-4 py-2 border rounded-md pl-10"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>
      
      {/* Mumineen Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITS ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mumineen.map((person) => (
                  <tr key={person.its_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{person.its_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {person.full_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{person.hof_its_id || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {person.its_id === person.hof_its_id || person.hof_its_id === null ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Head of Family
                        </span>
                      ) : 'Family Member'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{person.mobile}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link href={`/census/${person.its_id}`} className="text-green-600 hover:text-green-900">
                        <PencilSquareIcon className="h-5 w-5 inline" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex justify-between mt-4 px-4 py-2">
                <span className="text-sm text-gray-700">
                  {hasError ? 'Error loading data' : `Page ${currentPage} of ${totalPages}`}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="px-3 py-1 rounded text-sm border border-gray-300 bg-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {totalPages <= 5 ? (
                    // Show all pages if 5 or fewer
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-green-600 text-white' : 'border border-gray-300 bg-white'}`}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    // Show limited pages with ellipsis
                    <>
                      {currentPage > 2 && (
                        <button onClick={() => goToPage(1)} className="px-3 py-1 rounded text-sm border border-gray-300 bg-white">
                          1
                        </button>
                      )}
                      {currentPage > 3 && <span className="px-3 py-1">...</span>}
                      
                      {currentPage > 1 && (
                        <button onClick={() => goToPage(currentPage - 1)} className="px-3 py-1 rounded text-sm border border-gray-300 bg-white">
                          {currentPage - 1}
                        </button>
                      )}
                      
                      <button className="px-3 py-1 rounded text-sm bg-green-600 text-white">
                        {currentPage}
                      </button>
                      
                      {currentPage < totalPages && (
                        <button onClick={() => goToPage(currentPage + 1)} className="px-3 py-1 rounded text-sm border border-gray-300 bg-white">
                          {currentPage + 1}
                        </button>
                      )}
                      
                      {currentPage < totalPages - 2 && <span className="px-3 py-1">...</span>}
                      {currentPage < totalPages - 1 && (
                        <button onClick={() => goToPage(totalPages)} className="px-3 py-1 rounded text-sm border border-gray-300 bg-white">
                          {totalPages}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-3 py-1 rounded text-sm border border-gray-300 bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
