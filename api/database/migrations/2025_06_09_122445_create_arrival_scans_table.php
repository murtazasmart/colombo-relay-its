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
        Schema::create('arrival_scans', function (Blueprint $table) {
            $table->id();
            $table->string('its_id');
            $table->foreignId('user_id')->constrained();
            $table->foreignId('miqaat_id')->constrained()->onDelete('cascade');
            $table->timestamp('timestamp');
            $table->timestamps();
            
            $table->foreign('its_id')->references('its_id')->on('mumineen');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrival_scans');
    }
};
