import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Card,
    CardMedia,
    Alert,
    CircularProgress
} from '@mui/material'
import { CloudUpload, Delete } from '@mui/icons-material'
import { uploadImage, deleteImage } from '../services/api'

interface ImageUploaderProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    images = [],
    onChange,
    maxImages = 5
}) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > maxImages) {
            setError(`Máximo ${maxImages} imágenes permitidas`)
            return
        }

        setUploading(true)
        setError(null)

        try {
            const uploadPromises = acceptedFiles.map(file => uploadImage(file))
            const responses = await Promise.all(uploadPromises)

            const newImageUrls = responses.map(response => {
                const url = response.data.url
                // Asegurar que la URL esté limpia
                const cleanUrl = url.replace('/index.php/', '/')
                return cleanUrl
            })
            onChange([...images, ...newImageUrls])
        } catch (err: any) {
            setError('Error al subir las imágenes: ' + (err.response?.data?.message || err.message))
        } finally {
            setUploading(false)
        }
    }, [images, onChange, maxImages])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: true,
        disabled: uploading || images.length >= maxImages
    })

    const handleDeleteImage = async (imageUrl: string) => {
        try {
            // Extraer el path de la URL para eliminar del servidor
            const urlParts = imageUrl.split('/storage/')
            if (urlParts.length > 1) {
                await deleteImage(urlParts[1])
            }

            const updatedImages = images.filter(img => img !== imageUrl)
            onChange(updatedImages)
        } catch (err: any) {
            setError('Error al eliminar la imagen: ' + (err.response?.data?.message || err.message))
        }
    }

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Imágenes del Producto ({images.length}/{maxImages})
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Área de subida */}
            {images.length < maxImages && (
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed',
                        borderColor: isDragActive ? 'primary.main' : 'grey.300',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                        mb: 2,
                        transition: 'all 0.2s ease'
                    }}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CircularProgress size={40} sx={{ mb: 2 }} />
                            <Typography>Subiendo imágenes...</Typography>
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                {isDragActive
                                    ? 'Suelta las imágenes aquí'
                                    : 'Arrastra imágenes aquí o haz clic para seleccionar'
                                }
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Formatos: JPG, PNG, GIF, WebP (máx. 2MB por imagen)
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* Vista previa de imágenes */}
            {images.length > 0 && (
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Vista previa:
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        {images.map((imageUrl, index) => (
                            <Card key={index} sx={{ position: 'relative', width: 120, height: 120 }}>
                                <CardMedia
                                    component="img"
                                    height="120"
                                    image={imageUrl}
                                    alt={`Imagen ${index + 1}`}
                                    sx={{ objectFit: 'cover' }}
                                    onLoad={() => {
                                        console.log('Imagen cargada correctamente:', imageUrl)
                                    }}
                                    onError={(e: any) => {
                                        console.error('Error al cargar imagen:', imageUrl)
                                        e.target.onerror = null
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik02MCA3MkM1Ni43IDcyIDU0IDY5LjMgNTQgNjZDNTQgNjIuNyA1Ni43IDYwIDYwIDYwQzYzLjMgNjAgNjYgNjIuNyA2NiA2NkM2NiA2OS4zIDYzLjMgNzIgNjAgNzJaTTYwIDg0QzUwLjEgODQgNDIgNzkuNSA0MiA3OS41QzQyIDczLjUgNTAuMSA2OSA2MCA2OUM2OS45IDY5IDc4IDczLjUgNzggNzkuNUM3OCA3OS41IDY5LjkgODQgNjAgODRaIiBmaWxsPSIjOUM5Q0EzIi8+Cjwvc3ZnPgo='
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.9)'
                                        }
                                    }}
                                    onClick={() => handleDeleteImage(imageUrl)}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    )
}

export default ImageUploader
