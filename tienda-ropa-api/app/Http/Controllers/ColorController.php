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
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:50|unique:colors,name',
                'hex' => 'nullable|string|regex:/^#[a-fA-F0-9]{6}$/',
            ], [
                'name.required' => 'El nombre del color es obligatorio',
                'name.string' => 'El nombre debe ser una cadena de texto',
                'name.max' => 'El nombre no puede exceder 50 caracteres',
                'name.unique' => 'Ya existe un color con este nombre',
                'hex.regex' => 'El código hexadecimal debe tener el formato #RRGGBB',
            ]);

            $color = Color::create($validatedData);

            return response()->json([
                'data' => $color,
                'message' => 'Color creado exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el color',
                'error' => $e->getMessage()
            ], 500);
        }
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
        try {
            // Verificar si el color está siendo utilizado en productos
            $productsUsingColor = $color->stocks()->count();

            if ($productsUsingColor > 0) {
                return response()->json([
                    'message' => 'No se puede eliminar el color porque está siendo utilizado en productos existentes'
                ], 422);
            }

            $color->delete();

            return response()->json([
                'message' => 'Color eliminado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el color',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
