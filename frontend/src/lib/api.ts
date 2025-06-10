/**
 * API client for interacting with the Laravel backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Define interfaces for common data structures
interface Miqaat {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

interface MiqaatEvent {
  id: number;
  miqaat_id: number;
  name: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

interface Mumineen {
  its_id: string;
  eits_id?: string;
  hof_its_id: string | null;
  role_id?: number;
  full_name: string;
  name?: string; // Added for backward compatibility with mock data
  gender?: 'male' | 'female';
  age?: number;
  mobile?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

interface Accommodation {
  id: number;
  its_id: string;
  miqaat_id: string | number; // Allow string or number for compatibility
  name: string;
  accommodation_type: string;
  city: string;
  pincode?: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
  created_at?: string;
  updated_at?: string;
  mumineen_name?: string; // Added for form data compatibility
}

type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  message?: string;
};

/**
 * Make a request to the API
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      status: 'error',
      message: 'Failed to fetch data. Please try again.',
    };
  }
}

// API endpoints for Miqaats
export const MiqaatApi = {
  getAll: async () => {
    return fetchApi<Miqaat[]>('/miqaats');
  },
  getById: async (id: string) => {
    return fetchApi<Miqaat>(`/miqaats/${id}`);
  },
  getEvents: async (miqaatId: string) => {
    return fetchApi<MiqaatEvent[]>(`/miqaats/${miqaatId}/events`);
  },
};

// Pagination response type
type PaginatedResponse<T> = ApiResponse<T> & {
  meta?: {
    current_page: number,
    last_page: number,
    per_page: number,
    total: number
  }
};

// Query params type for the getAll method
type GetAllParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

// API endpoints for Mumineen
export const MumineenApi = {
  getAll: async (params: GetAllParams = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchApi<PaginatedResponse<Mumineen[]>>(`/mumineen${queryString}`);
  },
  
  getById: async (itsId: string) => {
    return fetchApi<Mumineen>(`/mumineen/${itsId}`);
  },
  
  search: async (query: string) => {
    return fetchApi<Mumineen[]>(`/mumineen/search?query=${encodeURIComponent(query)}`);
  },
  
  // Get family members by HOF ITS ID
  getFamilyByHofIts: async (hofItsId: string) => {
    return fetchApi<Mumineen[]>(`/mumineen/family/${hofItsId}`);
  },
  
  // Get all HOF mumineen (heads of families)
  getAllHofs: async () => {
    return fetchApi<Mumineen[]>('/mumineen/hofs');
  },
};

// API endpoints for Accommodations
export const AccommodationApi = {
  getAll: async () => {
    return fetchApi<Accommodation[]>('/accommodations');
  },
  getById: async (id: string) => {
    return fetchApi<Accommodation>(`/accommodations/${id}`);
  },
  create: async (data: Partial<Accommodation>) => {
    return fetchApi<Accommodation>('/accommodations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<Accommodation>) => {
    return fetchApi<Accommodation>(`/accommodations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return fetchApi<null>(`/accommodations/${id}`, {
      method: 'DELETE',
    });
  },
  getByHofIts: async (hofItsId: string) => {
    return fetchApi<Accommodation[]>(`/accommodations/family/${hofItsId}`);
  },
  createFamilyAccommodations: async (hofItsId: string, familyMembers: string[], accommodationData: Partial<Accommodation>) => {
    return fetchApi<Accommodation[]>('/accommodations/family', {
      method: 'POST',
      body: JSON.stringify({
        hof_its_id: hofItsId,
        family_members: familyMembers,
        accommodation: accommodationData
      }),
    });
  },
};
