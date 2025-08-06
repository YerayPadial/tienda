<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    public function index()
    {
        return Color::all();
    }

    public function store(Request $request)
    {
        $color = Color::create($request->all());
        return response()->json($color, 201);
    }

    public function show(Color $color)
    {
        return $color;
    }

    public function update(Request $request, Color $color)
    {
        $color->update($request->all());
        return $color;
    }

    public function destroy(Color $color)
    {
        $color->delete();
        return response()->json(null, 204);
    }
}
