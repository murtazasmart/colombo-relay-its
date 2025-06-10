<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mumineen;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class MumineenController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');
        
        $query = Mumineen::query();
        
        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('its_id', 'LIKE', "%{$search}%")
                  ->orWhere('full_name', 'LIKE', "%{$search}%")
                  ->orWhere('eits_id', 'LIKE', "%{$search}%");
            });
        }
        
        // Get paginated results
        $mumineen = $query->paginate($perPage);
        
        return response()->json([
            'status' => 'success',
            'data' => $mumineen->items(),
            'meta' => [
                'current_page' => $mumineen->currentPage(),
                'last_page' => $mumineen->lastPage(),
                'per_page' => $mumineen->perPage(),
                'total' => $mumineen->total()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'its_id' => 'required|string|unique:mumineen,its_id',
            'eits_id' => 'nullable|string',
            'hof_its_id' => 'nullable|string|exists:mumineen,its_id',
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female',
            'age' => 'nullable|integer',
            'mobile' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $mumineen = Mumineen::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Mumineen created successfully',
                'data' => $mumineen
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create mumineen',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        $mumineen = Mumineen::find($id);

        if (!$mumineen) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mumineen not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $mumineen
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        $mumineen = Mumineen::find($id);

        if (!$mumineen) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mumineen not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'its_id' => 'string|unique:mumineen,its_id,' . $id . ',its_id',
            'eits_id' => 'nullable|string',
            'hof_its_id' => 'nullable|string|exists:mumineen,its_id',
            'full_name' => 'string|max:255',
            'gender' => 'string|in:male,female',
            'age' => 'nullable|integer',
            'mobile' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $mumineen->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Mumineen updated successfully',
                'data' => $mumineen
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update mumineen',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        $mumineen = Mumineen::find($id);

        if (!$mumineen) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mumineen not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $mumineen->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Mumineen deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete mumineen',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all heads of families (HoF).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHofs()
    {
        try {
            // Get all mumineen who are heads of family (where hof_its_id is null or equals its_id)
            $hofs = Mumineen::where(function($query) {
                $query->whereNull('hof_its_id')
                      ->orWhereColumn('its_id', 'hof_its_id');
            })->get();

            return response()->json([
                'status' => 'success',
                'data' => $hofs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve heads of families',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get all family members for a specific Head of Family (HoF) by ITS ID.
     *
     * @param  string  $hofItsId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFamilyByHofIts(string $hofItsId)
    {
        try {
            // First verify the HoF exists
            $hofExists = Mumineen::where('its_id', $hofItsId)->exists();
            
            if (!$hofExists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Head of Family not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            // Get all family members where hof_its_id matches the given hofItsId
            $familyMembers = Mumineen::where('hof_its_id', $hofItsId)->get();
            
            // Also include the HoF themselves in the family members list
            $hof = Mumineen::where('its_id', $hofItsId)->first();
            if ($hof) {
                // Only add the HoF if they're not already in the collection
                $exists = $familyMembers->contains(function($member) use ($hofItsId) {
                    return $member->its_id === $hofItsId;
                });
                
                if (!$exists) {
                    $familyMembers->push($hof);
                }
            }
            
            return response()->json([
                'status' => 'success',
                'data' => $familyMembers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve family members',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get the Head of Family (HoF) ITS ID for a given user.
     * If the user is the HoF, returns their own ITS ID.
     *
     * @param  string  $itsId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHofByIts(string $itsId)
    {
        try {
            // Find the mumineen with the given ITS ID
            $mumineen = Mumineen::where('its_id', $itsId)->first();
            
            if (!$mumineen) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Mumineen not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            // If hof_its_id is null or the same as its_id, this person is the HoF
            $hofItsId = $mumineen->hof_its_id ?? $mumineen->its_id;
            
            // Get the HoF details
            $hof = Mumineen::where('its_id', $hofItsId)->first();
            
            if (!$hof) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Head of Family not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'hof_its_id' => $hofItsId,
                    'hof_details' => $hof,
                    'is_hof' => ($mumineen->its_id === $hofItsId || $mumineen->hof_its_id === null)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve Head of Family information',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Search for mumineen by name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $query = $request->get('q'); // Changed from 'query' to 'q' to match frontend API client
        
        if (!$query) {
            return response()->json([
                'status' => 'error',
                'message' => 'Search query is required'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        $mumineen = Mumineen::where('full_name', 'LIKE', "%{$query}%")
            ->orWhere('its_id', 'LIKE', "%{$query}%")
            ->orWhere('eits_id', 'LIKE', "%{$query}%")
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $mumineen
        ]);
    }
}
