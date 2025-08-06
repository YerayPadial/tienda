<?php

namespace App\Http\Controllers;

use App\Models\OrderProduct;
use Illuminate\Http\Request;

class OrderProductController extends Controller
{
    public function index()
    {
        return OrderProduct::all();
    }

    public function store(Request $request)
    {
        $op = OrderProduct::create($request->all());
        return response()->json($op, 201);
    }

    public function show(OrderProduct $orderProduct)
    {
        return $orderProduct;
    }

    public function update(Request $request, OrderProduct $orderProduct)
    {
        $orderProduct->update($request->all());
        return $orderProduct;
    }

    public function destroy(OrderProduct $orderProduct)
    {
        $orderProduct->delete();
        return response()->json(null, 204);
    }
}
