<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with([
            'items.product',
            'items.size',
            'items.color',
            'user'
        ])->orderBy('created_at', 'desc')->get();

        // Agregar el total calculado a cada pedido
        $orders = $orders->map(function ($order) {
            $order->calculated_total = $order->formatted_total;
            return $order;
        });

        return response()->json([
            'data' => $orders,
            'message' => 'Pedidos obtenidos exitosamente'
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'shipping_type' => 'required|in:domicilio,recogida',
            'shipping_data' => 'nullable|array',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.size_id' => 'nullable|exists:sizes,id',
            'items.*.color_id' => 'nullable|exists:colors,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            // Crear el pedido
            $order = Order::create([
                'user_id' => $request->user_id,
                'status' => 'pendiente',
                'shipping_type' => $request->shipping_type,
                'shipping_data' => $request->shipping_data,
                'payment_completed' => false,
            ]);

            // Crear los items del pedido
            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'size_id' => $item['size_id'],
                    'color_id' => $item['color_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Cargar las relaciones para la respuesta
            $order->load([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pedido creado exitosamente',
                'order' => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el pedido: ' . $e->getMessage()
            ], 500);
        }
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

        // Limpiar datos de envío para pedidos de recogida
        $orders = $orders->map(function ($order) {
            if ($order->shipping_type === 'recogida') {
                $order->shipping_data = null;
            }
            return $order;
        });

        return response()->json(['orders' => $orders]);
    }

    public function orderDetail(Order $order)
    {
        // Carga los productos, tallas y colores
        $order->load([
            'items.product',
            'items.size',
            'items.color',
            'user'
        ]);

        // Si el tipo de envío es recogida, no mostrar datos de envío
        if ($order->shipping_type === 'recogida') {
            $order->shipping_data = null;
        }

        return response()->json(['order' => $order]);
    }
}
