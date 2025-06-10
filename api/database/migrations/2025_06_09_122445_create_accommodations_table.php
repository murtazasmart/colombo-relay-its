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
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->string('its_id');
            $table->foreignId('miqaat_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('city');
            $table->string('pincode')->nullable();
            $table->string('accommodation_type');
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->timestamps();
            
            $table->foreign('its_id')->references('its_id')->on('mumineen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
