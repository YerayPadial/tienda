<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            $image = $request->file('image');

            // Generar un nombre único para la imagen
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();

            // Guardar directamente en public/storage/products
            $publicPath = public_path('storage/products/' . $imageName);
            $image->move(public_path('storage/products'), $imageName);

            // También guardar en storage/app/public/products para consistencia
            $storagePath = 'products/' . $imageName;
            copy($publicPath, storage_path('app/public/' . $storagePath));

            // Crear la URL completa de la imagen
            $imageUrl = url('storage/products/' . $imageName);

            return response()->json([
                'success' => true,
                'message' => 'Imagen subida correctamente',
                'data' => [
                    'url' => $imageUrl,
                    'path' => $storagePath,
                    'filename' => $imageName
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir la imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            $path = $request->input('path');

            // Eliminar de ambas ubicaciones
            $publicPath = public_path('storage/' . $path);
            $storagePath = storage_path('app/public/' . $path);

            $deleted = false;

            if (file_exists($publicPath)) {
                unlink($publicPath);
                $deleted = true;
            }

            if (file_exists($storagePath)) {
                unlink($storagePath);
                $deleted = true;
            }

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'Imagen eliminada correctamente'
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'La imagen no existe'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la imagen: ' . $e->getMessage()
            ], 500);
        }
    }
}
