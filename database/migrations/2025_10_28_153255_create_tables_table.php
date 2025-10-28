<?php

// database/migrations/2024_01_01_000001_create_businesses_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('owner_name');
            $table->enum('business_type', ['Food Establishment', 'Non-Food Establishment']);
            $table->text('address');
            $table->string('barangay');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->enum('establishment_category', [
                'Restaurant',
                'Bakery',
                'Sari-Sari Store',
                'Carinderia',
                'Food Cart',
                'Grocery',
                'Retail Store',
                'Salon',
                'Other'
            ])->nullable();
            $table->integer('number_of_employees')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};

// database/migrations/2024_01_01_000002_create_sanitary_permits_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sanitary_permits', function (Blueprint $table) {
            $table->id();
            $table->string('permit_number')->unique();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->enum('permit_type', ['New', 'Renewal']);
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->enum('status', [
                'Active',
                'Expiring Soon',
                'Expired',
                'Suspended',
                'Revoked',
                'Pending'
            ])->default('Pending');
            $table->foreignId('issued_by')->nullable()->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sanitary_permits');
    }
};

// database/migrations/2024_01_01_000003_create_inspections_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspections', function (Blueprint $table) {
            $table->id();
            $table->string('inspection_number')->unique();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('permit_id')->nullable()->constrained('sanitary_permits');
            $table->date('inspection_date');
            $table->time('inspection_time')->nullable();
            $table->foreignId('inspector_id')->constrained('users');
            $table->enum('inspection_type', [
                'Initial',
                'Renewal',
                'Follow-up',
                'Complaint-based',
                'Random'
            ]);
            $table->enum('result', [
                'Passed',
                'Passed with Conditions',
                'Failed',
                'Pending'
            ])->default('Pending');
            $table->decimal('overall_score', 5, 2)->nullable();
            $table->text('findings')->nullable();
            $table->text('recommendations')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};

// database/migrations/2024_01_01_000004_create_inspection_checklist_items_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspection_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_id')->constrained()->onDelete('cascade');
            $table->string('category'); // e.g., 'Food Safety', 'Sanitation', 'Waste Management'
            $table->string('item_description');
            $table->enum('status', ['Compliant', 'Non-Compliant', 'Not Applicable'])->default('Not Applicable');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspection_checklist_items');
    }
};

// database/migrations/2024_01_01_000005_create_permit_renewals_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permit_renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('previous_permit_id')->constrained('sanitary_permits');
            $table->foreignId('new_permit_id')->nullable()->constrained('sanitary_permits');
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->date('renewal_request_date');
            $table->enum('renewal_status', [
                'Pending',
                'Under Review',
                'Inspection Required',
                'Approved',
                'Rejected'
            ])->default('Pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permit_renewals');
    }
};

// database/migrations/2024_01_01_000006_create_violations_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('inspection_id')->nullable()->constrained();
            $table->string('violation_type');
            $table->text('description');
            $table->enum('severity', ['Minor', 'Major', 'Critical']);
            $table->date('violation_date');
            $table->date('compliance_deadline')->nullable();
            $table->enum('status', [
                'Open',
                'Under Correction',
                'Resolved',
                'Unresolved'
            ])->default('Open');
            $table->date('resolution_date')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};

// database/migrations/2024_01_01_000007_create_notifications_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->enum('notification_type', [
                'Permit Expiring',
                'Inspection Scheduled',
                'Inspection Completed',
                'Violation Issued',
                'Renewal Required',
                'Permit Approved',
                'Permit Rejected'
            ]);
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

// database/migrations/2024_01_01_000008_create_activity_logs_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('action'); // e.g., 'created', 'updated', 'deleted', 'viewed'
            $table->string('model_type'); // e.g., 'SanitaryPermit', 'Business'
            $table->unsignedBigInteger('model_id');
            $table->text('description');
            $table->json('changes')->nullable(); // Store old and new values
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};

// database/migrations/2024_01_01_000009_create_system_settings_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};

// database/migrations/2024_01_01_000010_add_roles_to_users_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'Admin',
                'Municipal Health Officer',
                'Sanitary Inspector',
                'Staff'
            ])->default('Staff')->after('password');
            $table->string('position')->nullable()->after('role');
            $table->boolean('is_active')->default(true)->after('position');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'position', 'is_active']);
        });
    }
};

// database/migrations/2024_01_01_000011_create_document_attachments_table.php

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_attachments', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable'); // Can attach to permits, inspections, etc.
            $table->string('document_type'); // e.g., 'Business Permit', 'DTI Registration', 'Photos'
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->unsignedBigInteger('file_size');
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_attachments');
    }
};
