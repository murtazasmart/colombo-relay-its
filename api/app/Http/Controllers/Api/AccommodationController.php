<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use App\Models\Mumineen;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AccommodationController extends Controller
{
    /**
     * Display a listing of accommodations.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $accommodations = Accommodation::with(['mumineen:its_id,full_name', 'miqaat:id,name'])
                ->get()
                ->map(function ($accommodation) {
                    // Enhance response with mumineen name for frontend display
                    $accommodation->mumineen_name = $accommodation->mumineen->full_name ?? 'Unknown';
                    $accommodation->miqaat_name = $accommodation->miqaat->name ?? 'Unknown';
                    
                    // Remove the relations from the response
                    unset($accommodation->mumineen);
                    unset($accommodation->miqaat);
                    
                    return $accommodation;
                });

            return response()->json([
                'status' => 'success',
                'data' => $accommodations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve accommodations',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created accommodation in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'its_id' => 'required|string|exists:mumineens,its_id',
            'miqaat_id' => 'required|exists:miqaats,id',
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'pincode' => 'nullable|string|max:20',
            'accommodation_type' => 'required|string|max:100',
            'room_number' => 'nullable|string|max:50',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $accommodation = Accommodation::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Accommodation created successfully',
                'data' => $accommodation
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create accommodation',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified accommodation.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $accommodation = Accommodation::with(['mumineen:its_id,full_name', 'miqaat:id,name'])->find($id);

            if (!$accommodation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Accommodation not found'
                ], Response::HTTP_NOT_FOUND);
            }

            // Enhance response with mumineen name for frontend display
            $accommodation->mumineen_name = $accommodation->mumineen->full_name ?? 'Unknown';
            $accommodation->miqaat_name = $accommodation->miqaat->name ?? 'Unknown';
            
            // Remove the relations from the response
            unset($accommodation->mumineen);
            unset($accommodation->miqaat);

            return response()->json([
                'status' => 'success',
                'data' => $accommodation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve accommodation',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified accommodation in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $accommodation = Accommodation::find($id);

        if (!$accommodation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accommodation not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'its_id' => 'string|exists:mumineens,its_id',
            'miqaat_id' => 'exists:miqaats,id',
            'name' => 'string|max:255',
            'city' => 'string|max:255',
            'pincode' => 'nullable|string|max:20',
            'accommodation_type' => 'string|max:100',
            'room_number' => 'nullable|string|max:50',
            'check_in_date' => 'date',
            'check_out_date' => 'date|after_or_equal:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $accommodation->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Accommodation updated successfully',
                'data' => $accommodation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update accommodation',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified accommodation from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $accommodation = Accommodation::find($id);

        if (!$accommodation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accommodation not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $accommodation->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Accommodation deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete accommodation',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get accommodations for a specific family by HoF ITS ID.
     *
     * @param  string  $hofItsId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByHofIts($hofItsId)
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
            
            // Get all family members' ITS IDs
            $familyItsIds = Mumineen::where('hof_its_id', $hofItsId)
                ->orWhere('its_id', $hofItsId)
                ->pluck('its_id')
                ->toArray();
            
            // Get accommodations for all family members
            $accommodations = Accommodation::with(['mumineen:its_id,full_name', 'miqaat:id,name'])
                ->whereIn('its_id', $familyItsIds)
                ->get()
                ->map(function ($accommodation) {
                    // Enhance response with mumineen name for frontend display
                    $accommodation->mumineen_name = $accommodation->mumineen->full_name ?? 'Unknown';
                    $accommodation->miqaat_name = $accommodation->miqaat->name ?? 'Unknown';
                    
                    // Remove the relations from the response
                    unset($accommodation->mumineen);
                    unset($accommodation->miqaat);
                    
                    return $accommodation;
                });
            
            return response()->json([
                'status' => 'success',
                'data' => $accommodations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve family accommodations',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
