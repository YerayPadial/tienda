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
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:50|unique:sizes,name',
            ], [
                'name.required' => 'El nombre de la talla es obligatorio',
                'name.string' => 'El nombre debe ser una cadena de texto',
                'name.max' => 'El nombre no puede exceder 50 caracteres',
                'name.unique' => 'Ya existe una talla con este nombre',
            ]);

            $size = Size::create($validatedData);

            return response()->json([
                'data' => $size,
                'message' => 'Talla creada exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la talla',
                'error' => $e->getMessage()
            ], 500);
        }
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
