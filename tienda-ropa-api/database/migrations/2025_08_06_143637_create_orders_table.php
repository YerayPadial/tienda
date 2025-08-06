<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('pendiente'); // pendiente, procesando, enviado...
            $table->string('shipping_type')->default('domicilio'); // domicilio o recogida
            $table->json('shipping_data')->nullable(); // datos de envío o recogida
            $table->boolean('payment_completed')->default(false);
            $table->string('ticket_path')->nullable(); // ruta del PDF generado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
