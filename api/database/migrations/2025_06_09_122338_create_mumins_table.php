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
        Schema::create('mumineen', function (Blueprint $table) {
            $table->string('its_id')->primary();
            $table->string('eits_id')->nullable();
            $table->string('hof_its_id')->nullable();
            $table->string('full_name');
            $table->enum('gender', ['male', 'female']);
            $table->integer('age')->nullable();
            $table->string('mobile')->nullable();
            $table->string('country')->nullable();
            $table->timestamps();
            
            $table->foreign('hof_its_id')->references('its_id')->on('mumineen')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mumineen');
    }
};
