import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Stack,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Chip,
    TextField
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import ImageUploader from '../components/ImageUploader'
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSizes,
    getColors,
    getProduct
} from '../services/api'

type Size = { id: number; name: string }
type Color = { id: number; name: string; hex?: string }
type Stock = { size_id: number; color_id: number; stock: number }
type Product = {
    id: number
    name: string
    description: string
    category: string
    gender: string
    price: number
    images: string[]
    stocks: Stock[]
    available_sizes?: string[]
    available_colors?: string[]
    total_stock?: number
}

// Tipo específico para el formulario
type ProductFormData = {
    name: string
    description: string
    category: string
    gender: string
    price: number
    images: string[]
    stocks: {
        size_id: number | string
        color_id: number | string
        stock: number
    }[]
}

const defaultValues: ProductFormData = {
    name: '',
    description: '',
    category: '',
    gender: 'unisex',
    price: 0,
    images: [],
    stocks: [{ size_id: '', color_id: '', stock: 0 }]
}

export default function Products() {
    // Data
    const [products, setProducts] = useState<Product[]>([])
    const [sizes, setSizes] = useState<Size[]>([])
    const [colors, setColors] = useState<Color[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleteDialog, setDeleteDialog] = useState(false)

    // Form RHF
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ProductFormData>({
        defaultValues
    })

    // Stocks field array
    const {
        fields: stockFields,
        append: appendStock,
        remove: removeStock
    } = useFieldArray({
        control,
        name: 'stocks'
    })

    // Fetch initial data
    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        setLoading(true)
        try {
            const [productsRes, sizesRes, colorsRes] = await Promise.all([
                getProducts(),
                getSizes(),
                getColors()
            ])

            setProducts(productsRes.data || [])
            setSizes(sizesRes.data || sizesRes || [])
            setColors(colorsRes.data || colorsRes || [])
            setError(null)
        } catch (err: any) {
            console.error('Error loading data:', err)
            setError('Error al cargar datos')
            // Asegurar que los arrays estén inicializados incluso en caso de error
            setProducts([])
            setSizes([])
            setColors([])
        }
        setLoading(false)
    }    // Dialog: New/Edit Product
    const handleOpenDialog = (product?: Product) => {
        setSuccess(null)
        setError(null)
        if (product) {
            setEditingProduct(product)
            // Load product for edit
            getProduct(product.id).then((res) => {
                const p = res.data
                reset({
                    name: p.name,
                    description: p.description,
                    category: p.category,
                    gender: p.gender,
                    price: p.price,
                    images: p.images ?? [],
                    stocks:
                        p.stocks.length > 0
                            ? p.stocks.map((s: Stock) => ({
                                size_id: s.size_id,
                                color_id: s.color_id,
                                stock: s.stock
                            }))
                            : [{ size_id: '', color_id: '', stock: 0 }]
                })
                setOpenDialog(true)
            })
        } else {
            setEditingProduct(null)
            reset(defaultValues)
            setOpenDialog(true)
        }
    }

    // Dialog: Delete Product
    const handleOpenDelete = (id: number) => {
        setDeleteId(id)
        setDeleteDialog(true)
    }

    // Submit
    const onSubmit = async (data: ProductFormData) => {
        setLoading(true)
        setError(null)
        setSuccess(null)
        try {
            // Transform stocks a integer ids
            const stocks = data.stocks.map((s) => ({
                size_id: Number(s.size_id),
                color_id: Number(s.color_id),
                stock: Number(s.stock)
            }))
            const payload = { ...data, stocks }
            if (editingProduct) {
                await updateProduct(editingProduct.id, payload)
                setSuccess('Producto actualizado correctamente')
            } else {
                await createProduct(payload)
                setSuccess('Producto creado correctamente')
            }
            setOpenDialog(false)
            fetchAll()
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error al guardar el producto. Revisa los campos.'
            )
        }
        setLoading(false)
    }

    // Delete
    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        try {
            if (deleteId) {
                await deleteProduct(deleteId)
                setSuccess('Producto eliminado correctamente')
                fetchAll()
            }
            setDeleteDialog(false)
        } catch (err: any) {
            setError('Error al eliminar el producto')
        }
        setLoading(false)
    }

    // RHF watch images (comentado porque no se usa actualmente)
    // const images = watch('images')

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={700}>
                    Gestión de Productos
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo producto
                </Button>
            </Stack>
            <Box mt={2}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
            </Box>
            <Paper sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Género</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Stock total</TableCell>
                            <TableCell>Tallas</TableCell>
                            <TableCell>Colores</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products && products.length > 0 && products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        {product.images?.[0] && (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                    marginRight: 8
                                                }}
                                                onError={(e: any) => {
                                                    e.target.onerror = null
                                                    e.target.src =
                                                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0yMCAyNEMxOC45IDI0IDE4IDIzLjEgMTggMjJDMTggMjAuOSAxOC45IDIwIDIwIDIwQzIxLjEgMjAgMjIgMjAuOSAyMiAyMkMyMiAyMy4xIDIxLjEgMjQgMjAgMjRaTTIwIDI4QzE2LjcgMjggMTQgMjYuNSAxNCAyNi41QzE0IDI0LjUgMTYuNyAyMyAyMCAyM0MyMy4zIDIzIDI2IDI0LjUgMjYgMjYuNUMyNiAyNi41IDIzLjMgMjggMjAgMjhaIiBmaWxsPSIjOUM5Q0EzIi8+Cjwvc3ZnPgo='
                                                }}
                                            />
                                        )}
                                        <Typography>{product.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.gender}
                                        color={
                                            product.gender === 'hombre'
                                                ? 'primary'
                                                : product.gender === 'mujer'
                                                    ? 'secondary'
                                                    : 'default'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {product.price.toLocaleString('es-ES', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}
                                </TableCell>
                                <TableCell>{product.total_stock ?? 0}</TableCell>
                                <TableCell>
                                    {product.available_sizes && product.available_sizes.length > 0 &&
                                        product.available_sizes.map((size) => (
                                            <Chip key={size} label={size} size="small" />
                                        ))
                                    }
                                </TableCell>
                                <TableCell>
                                    {product.available_colors && product.available_colors.length > 0 &&
                                        product.available_colors.map((color) => (
                                            <Chip key={color} label={color} size="small" />
                                        ))
                                    }
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="Editar"
                                        color="primary"
                                        onClick={() => handleOpenDialog(product)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Eliminar"
                                        color="error"
                                        onClick={() => handleOpenDelete(product.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No hay productos
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Dialogo crear/editar */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </DialogTitle>
                <DialogContent>
                    <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            {/* Nombre */}
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'El nombre es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                            {/* Descripción */}
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'La descripción es obligatoria' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                            {/* Categoría */}
                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: 'La categoría es obligatoria' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Categoría"
                                        fullWidth
                                        error={!!errors.category}
                                        helperText={errors.category?.message}
                                    />
                                )}
                            />
                            {/* Género */}
                            <Controller
                                name="gender"
                                control={control}
                                rules={{
                                    required: 'El género es obligatorio',
                                    validate: (v) =>
                                        ['hombre', 'mujer', 'unisex'].includes(v) ||
                                        'Valor inválido'
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Género"
                                        select
                                        fullWidth
                                        error={!!errors.gender}
                                        helperText={errors.gender?.message}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="hombre">Hombre</option>
                                        <option value="mujer">Mujer</option>
                                        <option value="unisex">Unisex</option>
                                    </TextField>
                                )}
                            />
                            {/* Precio */}
                            <Controller
                                name="price"
                                control={control}
                                rules={{
                                    required: 'El precio es obligatorio',
                                    min: { value: 0, message: 'El precio no puede ser negativo' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Precio (€)"
                                        type="number"
                                        fullWidth
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                )}
                            />
                            {/* Imágenes */}
                            <Controller
                                name="images"
                                control={control}
                                render={({ field }) => (
                                    <ImageUploader
                                        images={field.value || []}
                                        onChange={field.onChange}
                                        maxImages={5}
                                    />
                                )}
                            />
                            {/* Stocks */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Variaciones de stock (talla/color/cantidad)
                            </Typography>
                            {stockFields && stockFields.length > 0 && stockFields.map((item, idx) => (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    key={item.id}
                                    sx={{ mb: 1 }}
                                >
                                    {/* Talla */}
                                    <Controller
                                        name={`stocks.${idx}.size_id`}
                                        control={control}
                                        rules={{ required: 'Selecciona una talla' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Talla"
                                                select
                                                error={!!errors.stocks?.[idx]?.size_id}
                                                helperText={errors.stocks?.[idx]?.size_id?.message}
                                                style={{ minWidth: 120 }}
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Selecciona</option>
                                                {sizes && sizes.length > 0 && sizes.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                    {/* Color */}
                                    <Controller
                                        name={`stocks.${idx}.color_id`}
                                        control={control}
                                        rules={{ required: 'Selecciona un color' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Color"
                                                select
                                                error={!!errors.stocks?.[idx]?.color_id}
                                                helperText={errors.stocks?.[idx]?.color_id?.message}
                                                style={{ minWidth: 120 }}
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Selecciona</option>
                                                {colors && colors.length > 0 && colors.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                    {/* Stock */}
                                    <Controller
                                        name={`stocks.${idx}.stock`}
                                        control={control}
                                        rules={{
                                            required: 'Cantidad obligatoria',
                                            min: { value: 0, message: 'No negativo' }
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Cantidad"
                                                type="number"
                                                error={!!errors.stocks?.[idx]?.stock}
                                                helperText={errors.stocks?.[idx]?.stock?.message}
                                                style={{ minWidth: 100 }}
                                            />
                                        )}
                                    />
                                    <IconButton
                                        onClick={() => removeStock(idx)}
                                        color="error"
                                        disabled={stockFields.length === 1}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            ))}
                            <Button
                                onClick={() =>
                                    appendStock({ size_id: '', color_id: '', stock: 0 })
                                }
                                variant="outlined"
                                size="small"
                            >
                                Añadir variación
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button
                        type="submit"
                        form="product-form"
                        variant="contained"
                        disabled={loading}
                    >
                        {editingProduct ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo eliminar */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                <DialogTitle>Eliminar producto</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Seguro que quieres eliminar el producto? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}