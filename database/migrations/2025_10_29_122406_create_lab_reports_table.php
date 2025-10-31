<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lab_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id');
            $table->enum('application_type', ['new', 'renewal'])->comment('Type of permit application');
            $table->unsignedBigInteger('submitted_by')->comment('User who submitted the report');
            $table->unsignedBigInteger('inspected_by')->nullable()->comment('Lab inspector who reviewed');

            // Photo file paths
            $table->string('fecalysis_photo')->comment('Path to fecalysis examination photo');
            $table->string('xray_sputum_photo')->comment('Path to X-ray/Sputum examination photo');
            $table->string('receipt_photo')->comment('Path to receipt photo');
            $table->string('dti_photo')->comment('Path to DTI document photo');

            // Test results (pass/fail)
            $table->enum('fecalysis_result', ['pass', 'fail']);
            $table->enum('xray_sputum_result', ['pass', 'fail']);
            $table->enum('receipt_result', ['pass', 'fail']);
            $table->enum('dti_result', ['pass', 'fail']);

            // Remarks for each test
            $table->text('fecalysis_remarks')->nullable();
            $table->text('xray_sputum_remarks')->nullable();
            $table->text('receipt_remarks')->nullable();
            $table->text('dti_remarks')->nullable();
            $table->text('general_remarks')->nullable()->comment('General remarks from submitter');
            $table->text('inspector_remarks')->nullable()->comment('Remarks from lab inspector');

            // Status and overall result
            $table->enum('status', ['pending', 'approved', 'rejected', 'failed'])->default('pending');
            $table->enum('overall_result', ['pass', 'fail'])->comment('Overall result based on all tests');

            // Timestamps
            $table->timestamp('submitted_at')->nullable()->comment('When the report was submitted');
            $table->timestamp('inspected_at')->nullable()->comment('When the report was inspected');
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('business_id')
                ->references('id')
                ->on('businesses')
                ->onDelete('cascade');

            $table->foreign('submitted_by')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('inspected_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            // Indexes
            $table->index('business_id');
            $table->index('status');
            $table->index('application_type');
            $table->index('submitted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_reports');
    }
};
