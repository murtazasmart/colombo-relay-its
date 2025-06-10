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
        Schema::create('miqaat_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miqaat_id')->constrained()->onDelete('cascade');
            $table->string('its_id');
            $table->date('registration_date');
            $table->timestamps();
            
            $table->foreign('its_id')->references('its_id')->on('mumineen')->onDelete('cascade');
            $table->unique(['miqaat_id', 'its_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('miqaat_registrations');
    }
};
