<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@spar.local',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'position' => 'System Administrator',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Health Officer',
            'email' => 'officer@spar.local',
            'password' => Hash::make('password'),
            'role' => 'Municipal Health Officer',
            'position' => 'Municipal Health Officer',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Inspector',
            'email' => 'inspector@spar.local',
            'password' => Hash::make('password'),
            'role' => 'Sanitary Inspector',
            'position' => 'Sanitary Inspector',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
