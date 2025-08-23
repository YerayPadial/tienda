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

                // Si el tipo de envío es recogida, no mostrar datos de envío
                if ($order->shipping_type === 'recogida') {
                    $order->shipping_data = null;
                }

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
        try {
            // Validación base
            $rules = [
                'user_id' => 'required|exists:users,id',
                'status' => 'sometimes|string|in:pendiente,procesando,enviado,entregado',
                'shipping_type' => 'required|string|in:domicilio,recogida',
                'shipping_data' => 'sometimes|array',
                'payment_completed' => 'sometimes|boolean',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.size_id' => 'nullable|exists:sizes,id',
                'items.*.color_id' => 'nullable|exists:colors,id',
            ];

            $messages = [
                'user_id.required' => 'El usuario es obligatorio',
                'user_id.exists' => 'El usuario no existe',
                'status.in' => 'El estado debe ser: pendiente, procesando, enviado o entregado',
                'shipping_type.required' => 'El tipo de envío es obligatorio',
                'shipping_type.in' => 'El tipo de envío debe ser: domicilio o recogida',
                'items.required' => 'Los artículos son obligatorios',
                'items.min' => 'Debe haber al menos un artículo',
                'items.*.product_id.required' => 'El producto es obligatorio',
                'items.*.product_id.exists' => 'El producto no existe',
                'items.*.quantity.required' => 'La cantidad es obligatoria',
                'items.*.quantity.min' => 'La cantidad debe ser mayor a 0',
            ];

            // Si el tipo de envío es domicilio, validar campos de envío
            if ($request->input('shipping_type') === 'domicilio') {
                $rules = array_merge($rules, [
                    'shipping_data.address' => 'nullable|string|max:255',
                    'shipping_data.city' => 'nullable|string|max:100',
                    'shipping_data.postal_code' => 'nullable|string|max:10',
                    'shipping_data.province' => 'nullable|string|max:100',
                    'shipping_data.phone' => 'nullable|string|max:20',
                    'shipping_data.notes' => 'nullable|string|max:500',
                ]);

                $messages = array_merge($messages, [
                    'shipping_data.address.max' => 'La dirección no puede exceder 255 caracteres',
                    'shipping_data.city.max' => 'La ciudad no puede exceder 100 caracteres',
                    'shipping_data.postal_code.max' => 'El código postal no puede exceder 10 caracteres',
                    'shipping_data.province.max' => 'La provincia no puede exceder 100 caracteres',
                    'shipping_data.phone.max' => 'El teléfono no puede exceder 20 caracteres',
                    'shipping_data.notes.max' => 'Las notas no pueden exceder 500 caracteres',
                ]);
            }

            $validatedData = $request->validate($rules, $messages);

            // Si el tipo de envío es recogida, limpiar datos de envío
            if ($validatedData['shipping_type'] === 'recogida') {
                $validatedData['shipping_data'] = null;
            }

            // Crear el pedido
            $order = Order::create([
                'user_id' => $validatedData['user_id'],
                'status' => $validatedData['status'] ?? 'pendiente',
                'shipping_type' => $validatedData['shipping_type'],
                'shipping_data' => $validatedData['shipping_data'],
                'payment_completed' => $validatedData['payment_completed'] ?? false,
            ]);

            // Crear los artículos del pedido
            foreach ($validatedData['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'size_id' => $item['size_id'] ?? null,
                    'color_id' => $item['color_id'] ?? null,
                ]);
            }

            // Cargar relaciones para la respuesta
            $order->load(['items.product', 'items.size', 'items.color', 'user']);
            $order->calculated_total = $order->formatted_total;
            $order->items_count = $order->items->count();

            return response()->json([
                'data' => $order,
                'message' => 'Pedido creado exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el pedido',
                'error' => $e->getMessage()
            ], 500);
        }
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

            // Si el tipo de envío es recogida, no mostrar datos de envío en la respuesta
            if ($order->shipping_type === 'recogida') {
                $order->shipping_data = null;
            }

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
            // Validación base
            $rules = [
                'status' => 'required|string|in:pendiente,procesando,enviado,entregado',
                'shipping_type' => 'sometimes|string|in:domicilio,recogida',
                'shipping_data' => 'sometimes|array',
                'payment_completed' => 'sometimes|boolean',
            ];

            $messages = [
                'status.required' => 'El estado es obligatorio',
                'status.in' => 'El estado debe ser: pendiente, procesando, enviado o entregado',
                'shipping_type.in' => 'El tipo de envío debe ser: domicilio o recogida',
            ];

            // Si el tipo de envío es domicilio, validar campos de envío
            $shippingType = $request->input('shipping_type', $order->shipping_type);
            if ($shippingType === 'domicilio' && $request->has('shipping_data') && $request->input('shipping_data') !== null) {
                $rules = array_merge($rules, [
                    'shipping_data.address' => 'nullable|string|max:255',
                    'shipping_data.city' => 'nullable|string|max:100',
                    'shipping_data.postal_code' => 'nullable|string|max:10',
                    'shipping_data.province' => 'nullable|string|max:100',
                    'shipping_data.phone' => 'nullable|string|max:20',
                    'shipping_data.notes' => 'nullable|string|max:500',
                ]);

                $messages = array_merge($messages, [
                    'shipping_data.address.max' => 'La dirección no puede exceder 255 caracteres',
                    'shipping_data.city.max' => 'La ciudad no puede exceder 100 caracteres',
                    'shipping_data.postal_code.max' => 'El código postal no puede exceder 10 caracteres',
                    'shipping_data.province.max' => 'La provincia no puede exceder 100 caracteres',
                    'shipping_data.phone.max' => 'El teléfono no puede exceder 20 caracteres',
                    'shipping_data.notes.max' => 'Las notas no pueden exceder 500 caracteres',
                ]);
            }

            $validatedData = $request->validate($rules, $messages);

            // Si el tipo de envío es recogida, limpiar datos de envío
            if (isset($validatedData['shipping_type']) && $validatedData['shipping_type'] === 'recogida') {
                $validatedData['shipping_data'] = null;
            }

            $order->update($validatedData);

            // Recargar el pedido con sus relaciones
            $order->load([
                'items.product',
                'items.size',
                'items.color',
                'user'
            ]);

            $order->calculated_total = $order->formatted_total;

            // Si el tipo de envío es recogida, no mostrar datos de envío en la respuesta
            if ($order->shipping_type === 'recogida') {
                $order->shipping_data = null;
            }

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
