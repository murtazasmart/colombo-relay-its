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
        Schema::create('waaz_center_preferences', function (Blueprint $table) {
            $table->id();
            $table->string('its_id');
            $table->foreignId('waaz_center_id')->constrained()->onDelete('cascade');
            $table->foreignId('miqaat_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->foreign('its_id')->references('its_id')->on('mumineen');
            $table->unique(['its_id', 'miqaat_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waaz_center_preferences');
    }
};
