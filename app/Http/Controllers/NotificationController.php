<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::forUser(auth()->id())
            ->latest()
            ->paginate(20);

        $unreadCount = Notification::forUser(auth()->id())
            ->unread()
            ->count();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function getUnread()
    {
        $notifications = Notification::forUser(auth()->id())
            ->unread()
            ->latest()
            ->limit(10)
            ->get();

        $unreadCount = Notification::forUser(auth()->id())
            ->unread()
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::forUser(auth()->id())
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead()
    {
        Notification::forUser(auth()->id())
            ->unread()
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read');
    }

    public function destroy($id)
    {
        $notification = Notification::forUser(auth()->id())
            ->findOrFail($id);

        $notification->delete();

        return back()->with('success', 'Notification deleted');
    }
}
