<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MiqaatEvent;
use App\Models\Miqaat;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class MiqaatEventController extends Controller
{
    /**
     * Display a listing of the resource for a specific miqaat.
     *
     * @param string $miqaatId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(string $miqaatId)
    {
        $miqaat = Miqaat::find($miqaatId);
        
        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        $events = MiqaatEvent::where('miqaat_id', $miqaatId)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $events
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $miqaatId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, string $miqaatId)
    {
        $miqaat = Miqaat::find($miqaatId);
        
        if (!$miqaat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'datetime' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $event = new MiqaatEvent($request->all());
            $event->miqaat_id = $miqaatId;
            $event->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat event created successfully',
                'data' => $event
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create miqaat event',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $miqaatId
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $miqaatId, string $id)
    {
        $event = MiqaatEvent::where('id', $id)
            ->where('miqaat_id', $miqaatId)
            ->first();

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat event not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $miqaatId
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $miqaatId, string $id)
    {
        $event = MiqaatEvent::where('id', $id)
            ->where('miqaat_id', $miqaatId)
            ->first();

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat event not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'datetime' => 'date',
            'location' => 'string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $event->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat event updated successfully',
                'data' => $event
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update miqaat event',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $miqaatId
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $miqaatId, string $id)
    {
        $event = MiqaatEvent::where('id', $id)
            ->where('miqaat_id', $miqaatId)
            ->first();

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => 'Miqaat event not found'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $event->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Miqaat event deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete miqaat event',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
