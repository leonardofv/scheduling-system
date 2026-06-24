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
        Schema::create('agendamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('tipo')->default('consulta');
            $table->foreignId('medico_id')->nullable()->constrained('medicos');
            $table->foreignId('exame_id')->nullable()->constrained('exames');
            $table->foreignId('agendamento_origem_id')->nullable()->constrained('agendamentos')->onDelete('set null');
            $table->date('date');
            $table->time('time');
            $table->string('observation')->nullable();
            $table->string('status')->default('pendente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendamentos');
    }
};
