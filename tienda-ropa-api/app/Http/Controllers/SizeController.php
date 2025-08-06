<?php

namespace App\Http\Controllers;

use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function index()
    {
        return Size::all();
    }

    public function store(Request $request)
    {
        $size = Size::create($request->all());
        return response()->json($size, 201);
    }

    public function show(Size $size)
    {
        return $size;
    }

    public function update(Request $request, Size $size)
    {
        $size->update($request->all());
        return $size;
    }

    public function destroy(Size $size)
    {
        $size->delete();
        return response()->json(null, 204);
    }
}
