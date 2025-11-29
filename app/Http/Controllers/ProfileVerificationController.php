<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileVerificationController extends Controller
{
    /**
     * Verify user password before accessing profile settings
     */
    public function verify(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        // Check if password matches
        if (!Hash::check($request->password, auth()->user()->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        // Store verification timestamp in session (valid for 15 minutes)
        session(['profile_verified_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Password verified successfully',
        ]);
    }

    /**
     * Check if user is verified to access profile settings
     */
    public function checkVerification()
    {
        $verifiedAt = session('profile_verified_at');

        if (!$verifiedAt) {
            return response()->json(['verified' => false]);
        }

        // Check if verification is still valid (15 minutes)
        $isValid = now()->diffInMinutes($verifiedAt) < 15;

        if (!$isValid) {
            session()->forget('profile_verified_at');
        }

        return response()->json([
            'verified' => $isValid,
            'expires_in' => $isValid ? 15 - now()->diffInMinutes($verifiedAt) : 0,
        ]);
    }
}
