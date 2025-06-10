<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Miqaat;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class MiqaatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $miqaats = Miqaat::all();
        return response()->json([
            'status' => 'success',
            'data' => $miqaats
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
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'required|string|in:upcoming,ongoing,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $miqaat = Miqaat::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat created successfully',
                'data' => $miqaat
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create miqaat',
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
        $miqaat = Miqaat::find($id);

        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $miqaat
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
        $miqaat = Miqaat::find($id);

        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'string|in:upcoming,ongoing,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $miqaat->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat updated successfully',
                'data' => $miqaat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update miqaat',
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
        $miqaat = Miqaat::find($id);

        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $miqaat->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete miqaat',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get upcoming miqaats.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcoming()
    {
        $upcoming = Miqaat::where('status', 'upcoming')
            ->orWhere(function($query) {
                $query->where('status', 'ongoing')
                      ->where('end_date', '>=', now());
            })
            ->orderBy('start_date', 'asc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $upcoming
        ]);
    }
    
    /**
     * Get miqaat with its events.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function withEvents(string $id)
    {
        $miqaat = Miqaat::with('events')->find($id);
        
        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $miqaat
        ]);
    }
}
