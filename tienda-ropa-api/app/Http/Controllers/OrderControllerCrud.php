<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderControllerCrud extends Controller
{
    // Obtener todos los pedidos con paginación y filtros

    public function index(Request $request)
    {
        try {
            $query = Order::with([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            // Filtrado por búsqueda
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            }

            // Filtrado por estado
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');

            // Manejar casos especiales de ordenamiento
            switch ($sortBy) {
                case 'user.name':
                case 'user_name':
                    $query->join('users', 'orders.user_id', '=', 'users.id')
                        ->orderBy('users.name', $sortOrder)
                        ->select('orders.*');
                    break;
                case 'items_count':
                    $query->withCount('items')
                        ->orderBy('items_count', $sortOrder);
                    break;
                case 'calculated_total':
                    // Para el total calculado, usamos una subconsulta para evitar problemas con los with()
                    $query->orderByRaw('(
                        SELECT SUM(products.price * order_products.quantity)
                        FROM order_products
                        JOIN products ON order_products.product_id = products.id
                        WHERE order_products.order_id = orders.id
                    ) ' . $sortOrder);
                    break;
                default:
                    // Para campos normales de la tabla orders
                    if (in_array($sortBy, ['id', 'status', 'created_at', 'updated_at', 'payment_completed'])) {
                        $query->orderBy($sortBy, $sortOrder);
                    } else {
                        // Fallback a created_at si el campo no es válido
                        $query->orderBy('created_at', $sortOrder);
                    }
                    break;
            }

            // Paginación
            $perPage = $request->get('perPage', 10);
            $orders = $query->paginate($perPage);

            // Agregar el total calculado a cada pedido
            $ordersData = $orders->items();
            $ordersData = array_map(function ($order) {
                $order->calculated_total = $order->formatted_total;
                $order->items_count = $order->items->count();
                return $order;
            }, $ordersData);

            return response()->json([
                'data' => $ordersData,
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
                'message' => 'Pedidos obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener pedidos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all());
        return response()->json($order, 201);
    }

    // Mostrar un pedido específico con todos sus detalles
    public function show(Order $order)
    {
        try {
            $order->load([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            $order->calculated_total = $order->formatted_total;
            $order->items_count = $order->items->count();

            return response()->json([
                'data' => $order,
                'message' => 'Pedido obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Pedido no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Actualizar un pedido (principalmente el estado)

    public function update(Request $request, Order $order)
    {
        try {
            $validatedData = $request->validate([
                'status' => 'required|string|in:pendiente,procesando,enviado,entregado',
                'shipping_type' => 'sometimes|string',
                'shipping_data' => 'sometimes|array',
                'payment_completed' => 'sometimes|boolean',
            ], [
                'status.required' => 'El estado es obligatorio',
                'status.in' => 'El estado debe ser: pendiente, procesando, enviado o entregado',
            ]);

            $order->update($validatedData);

            // Recargar el pedido con sus relaciones
            $order->load([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            $order->calculated_total = $order->formatted_total;

            return response()->json([
                'data' => $order,
                'message' => 'Pedido actualizado exitosamente'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar un pedido

    public function destroy(Order $order)
    {
        try {
            DB::beginTransaction();

            // Eliminar items del pedido
            $order->items()->delete();

            // Eliminar el pedido
            $order->delete();

            DB::commit();

            return response()->json([
                'message' => 'Pedido eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al eliminar pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Actualizar los items de un pedido

    public function updateItems(Request $request, Order $order)
    {
        try {
            $validatedData = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.id' => 'sometimes|exists:order_products,id',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.size_id' => 'required|exists:sizes,id',
                'items.*.color_id' => 'required|exists:colors,id',
                'items.*.quantity' => 'required|integer|min:1',
            ], [
                'items.required' => 'Los items son obligatorios',
                'items.min' => 'Debe haber al menos un item',
            ]);

            DB::beginTransaction();

            // Obtener IDs de items que se van a mantener/actualizar
            $keepItemIds = [];
            foreach ($validatedData['items'] as $itemData) {
                if (isset($itemData['id'])) {
                    $keepItemIds[] = $itemData['id'];
                }
            }

            // Eliminar items que no están en la nueva lista
            $order->items()->whereNotIn('id', $keepItemIds)->delete();

            // Crear o actualizar items
            foreach ($validatedData['items'] as $itemData) {
                if (isset($itemData['id'])) {
                    // Actualizar item existente
                    OrderProduct::where('id', $itemData['id'])
                        ->where('order_id', $order->id)
                        ->update([
                            'product_id' => $itemData['product_id'],
                            'size_id' => $itemData['size_id'],
                            'color_id' => $itemData['color_id'],
                            'quantity' => $itemData['quantity'],
                        ]);
                } else {
                    // Crear nuevo item
                    OrderProduct::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'size_id' => $itemData['size_id'],
                        'color_id' => $itemData['color_id'],
                        'quantity' => $itemData['quantity'],
                    ]);
                }
            }

            DB::commit();

            // Recargar el pedido con sus relaciones actualizadas
            $order->load([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            $order->calculated_total = $order->formatted_total;

            return response()->json([
                'data' => $order,
                'message' => 'Items del pedido actualizados exitosamente'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar items del pedido',
                'error' => $e->getMessage()
            ], 500);
        }
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

    public function orderDetail(Order $order)
    {
        // Carga los productos, tallas y colores
        $order->load([
            'items.product',
            'items.size',
            'items.color',
            'user'
        ]);

        return response()->json(['order' => $order]);
    }
}
