<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::all();
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all());
        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return $order;
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->all());
        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }

    // Obtener todos los pedidos de un usuario concreto
    public function userOrders(Request $request)
    {
        $userId = $request->query('user_id') ?? $request->input('user_id');
        if (!$userId) {
            return response()->json(['message' => 'Falta el parámetro user_id'], 400);
        }

        // Carga las relaciones de productos y sus detalles
        $orders = Order::where('user_id', $userId)
            ->with([
                'items.product',    
                'items.size',       
                'items.color'     
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }
}
