<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'app_name' => config('app.name'),
                'timezone' => config('app.timezone'),
                'locale' => config('app.locale'),
                // Add any system-wide settings you want to manage
            ],
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        // Handle settings updates
        $validated = $request->validate([
            'app_name' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string',
            'locale' => 'sometimes|string',
        ]);

        // Update settings logic here
        // You might want to store these in a settings table or config files

        return back()->with('success', 'Settings updated successfully');
    }
}
