<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Business;
use App\Models\SanitaryPermit;
use App\Models\Inspection;
use App\Models\InspectionChecklistItem;
use App\Models\Violation;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@tibiao.gov.ph',
            'password' => Hash::make('password123'),
            'role' => 'Admin',
            'position' => 'System Administrator',
            'is_active' => true,
        ]);

        // Create Municipal Health Officer
        $mho = User::create([
            'name' => 'Dr. Maria Santos',
            'email' => 'mho@tibiao.gov.ph',
            'password' => Hash::make('password123'),
            'role' => 'Municipal Health Officer',
            'position' => 'Municipal Health Officer',
            'is_active' => true,
        ]);

        // Create Sanitary Inspectors
        $inspector1 = User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'inspector1@tibiao.gov.ph',
            'password' => Hash::make('password123'),
            'role' => 'Sanitary Inspector',
            'position' => 'Sanitary Inspector I',
            'is_active' => true,
        ]);

        $inspector2 = User::create([
            'name' => 'Maria Garcia',
            'email' => 'inspector2@tibiao.gov.ph',
            'password' => Hash::make('password123'),
            'role' => 'Sanitary Inspector',
            'position' => 'Sanitary Inspector II',
            'is_active' => true,
        ]);

        // Create Staff
        $staff = User::create([
            'name' => 'Pedro Reyes',
            'email' => 'staff@tibiao.gov.ph',
            'password' => Hash::make('password123'),
            'role' => 'Staff',
            'position' => 'Administrative Aide',
            'is_active' => true,
        ]);

        // Barangays in Tibiao
        $barangays = [
            'Alegre',
            'Bagacay',
            'Bongbongan I',
            'Bongbongan II',
            'Caraudan',
            'Castillo',
            'Cato',
            'Cubay',
            'El Progreso',
            'Esparagoza',
            'Importante',
            'Nica-an',
            'Lindero',
            'Malacañang',
            'Tigbaboy',
            'Poblacion',
            'San Jose',
            'San Pedro',
            'Supa',
            'Tina'
        ];

        // Sample Businesses
        $businessesData = [
            [
                'business_name' => 'Tibiao Bakery',
                'owner_name' => 'Roberto Santos',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Bakery',
                'contact_number' => '09123456789',
                'email' => 'tibiaobakery@gmail.com',
                'number_of_employees' => 5,
            ],
            [
                'business_name' => 'Carinderia ni Aling Rosa',
                'owner_name' => 'Rosa Dela Cruz',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Carinderia',
                'contact_number' => '09187654321',
                'number_of_employees' => 3,
            ],
            [
                'business_name' => 'Sari-Sari Store ni Nene',
                'owner_name' => 'Nena Garcia',
                'business_type' => 'Non-Food Establishment',
                'establishment_category' => 'Sari-Sari Store',
                'contact_number' => '09198765432',
                'number_of_employees' => 2,
            ],
            [
                'business_name' => 'Tibiao Meat Shop',
                'owner_name' => 'Carlos Reyes',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Grocery',
                'contact_number' => '09156789012',
                'number_of_employees' => 4,
            ],
            [
                'business_name' => 'Liza\'s Beauty Salon',
                'owner_name' => 'Liza Mendoza',
                'business_type' => 'Non-Food Establishment',
                'establishment_category' => 'Salon',
                'contact_number' => '09167890123',
                'number_of_employees' => 3,
            ],
            [
                'business_name' => 'Manong\'s Food Cart',
                'owner_name' => 'Manuel Torres',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Food Cart',
                'contact_number' => '09178901234',
                'number_of_employees' => 1,
            ],
            [
                'business_name' => 'Tibiao Mini Mart',
                'owner_name' => 'Antonio Ramos',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Grocery',
                'contact_number' => '09189012345',
                'email' => 'tibiaominimart@yahoo.com',
                'number_of_employees' => 8,
            ],
            [
                'business_name' => 'Ate Mely\'s Restaurant',
                'owner_name' => 'Melinda Cruz',
                'business_type' => 'Food Establishment',
                'establishment_category' => 'Restaurant',
                'contact_number' => '09190123456',
                'number_of_employees' => 6,
            ],
        ];

        $businesses = [];
        foreach ($businessesData as $index => $businessData) {
            $business = Business::create(array_merge($businessData, [
                'address' => 'Block ' . ($index + 1) . ', ' . $barangays[array_rand($barangays)],
                'barangay' => $barangays[array_rand($barangays)],
                'is_active' => true,
            ]));
            $businesses[] = $business;

            // Create Sanitary Permit for each business
            $issueDate = now()->subMonths(rand(1, 12));
            $expiryDate = (clone $issueDate)->addYear();

            $status = 'Active';
            if ($expiryDate < now()) {
                $status = 'Expired';
            } elseif ($expiryDate <= now()->addDays(30)) {
                $status = 'Expiring Soon';
            }

            $permit = SanitaryPermit::create([
                'permit_number' => 'SP-2024-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'business_id' => $business->id,
                'permit_type' => $index < 2 ? 'New' : 'Renewal',
                'issue_date' => $issueDate,
                'expiry_date' => $expiryDate,
                'status' => $status,
                'issued_by' => $inspector1->id,
                'approved_by' => $mho->id,
            ]);

            // Create Inspection for the business
            $inspectionDate = (clone $issueDate)->subDays(5);

            $inspection = Inspection::create([
                'inspection_number' => 'INS-2024-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'business_id' => $business->id,
                'permit_id' => $permit->id,
                'inspection_date' => $inspectionDate,
                'inspection_time' => '09:00:00',
                'inspector_id' => rand(0, 1) ? $inspector1->id : $inspector2->id,
                'inspection_type' => $index < 2 ? 'Initial' : 'Renewal',
                'result' => rand(0, 10) > 2 ? 'Passed' : 'Passed with Conditions',
                'overall_score' => rand(75, 100),
                'findings' => 'Business premises are generally well-maintained and comply with sanitation standards.',
                'recommendations' => 'Continue maintaining current standards. Minor improvements recommended for food storage area.',
            ]);

            // Create sample checklist items
            $categories = [
                'Premises' => ['Floors clean', 'Walls maintained', 'Good lighting', 'Waste disposal adequate'],
                'Food Handling' => ['Proper temperatures', 'No cross-contamination', 'Clean preparation areas'],
                'Sanitation' => ['Handwashing available', 'Clean toilets', 'Potable water', 'Pest control'],
                'Personnel' => ['Health certificates', 'Good hygiene', 'Protective clothing'],
            ];

            foreach ($categories as $category => $items) {
                foreach ($items as $item) {
                    InspectionChecklistItem::create([
                        'inspection_id' => $inspection->id,
                        'category' => $category,
                        'item_description' => $item,
                        'status' => rand(0, 10) > 1 ? 'Compliant' : 'Non-Compliant',
                    ]);
                }
            }

            // Create a violation for some businesses
            if (rand(0, 10) > 7) {
                Violation::create([
                    'business_id' => $business->id,
                    'inspection_id' => $inspection->id,
                    'violation_type' => 'Food Storage',
                    'description' => 'Improper food storage temperature observed.',
                    'severity' => 'Minor',
                    'violation_date' => $inspectionDate,
                    'compliance_deadline' => (clone $inspectionDate)->addDays(7),
                    'status' => rand(0, 1) ? 'Resolved' : 'Under Correction',
                ]);
            }
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin credentials: admin@tibiao.gov.ph / password123');
        $this->command->info('MHO credentials: mho@tibiao.gov.ph / password123');
        $this->command->info('Inspector credentials: inspector1@tibiao.gov.ph / password123');
    }
}
