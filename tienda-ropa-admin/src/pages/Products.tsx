import { useEffect, useState, useMemo } from 'react'
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
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Avatar
} from '@mui/material'
import {
    Add,
    Edit,
    Delete,
    ArrowUpward,
    ArrowDownward,
    FilterList,
    ShoppingBag,
    Euro,
    Inventory,
    Category,
    Person,
    Image
} from '@mui/icons-material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type PaginationState
} from '@tanstack/react-table'
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

const columnHelper = createColumnHelper<Product>()

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

    // Estados de la tabla
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')

    // Form React Hook Form
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

    // Definición de columnas
    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                size: 80,
                cell: (info) => (
                    <Chip
                        label={`#${info.getValue()}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                ),
            }),
            columnHelper.accessor('images', {
                header: 'Imagen',
                size: 80,
                enableSorting: false,
                cell: (info) => {
                    const images = info.getValue()
                    return (
                        <Avatar
                            src={images && images.length > 0 ? images[0] : undefined}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                        >
                            <Image />
                        </Avatar>
                    )
                },
            }),
            columnHelper.accessor('name', {
                header: 'Nombre',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <ShoppingBag color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                            {info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('category', {
                header: 'Categoría',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Category color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('gender', {
                header: 'Género',
                cell: (info) => {
                    const gender = info.getValue()
                    const genderConfig = {
                        'hombre': { label: 'Hombre', color: 'info' as const },
                        'mujer': { label: 'Mujer', color: 'secondary' as const },
                        'unisex': { label: 'Unisex', color: 'default' as const }
                    }
                    const config = genderConfig[gender as keyof typeof genderConfig] || genderConfig.unisex

                    return (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Person color="action" fontSize="small" />
                            <Chip
                                label={config.label}
                                size="small"
                                color={config.color}
                                variant="outlined"
                            />
                        </Box>
                    )
                },
            }),
            columnHelper.accessor('price', {
                header: 'Precio',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Euro color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                            €{Number(info.getValue()).toFixed(2)}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('total_stock', {
                header: 'Stock Total',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Inventory color="action" fontSize="small" />
                        <Chip
                            label={info.getValue() || 0}
                            size="small"
                            color={((info.getValue() || 0) > 0) ? 'success' : 'error'}
                            variant="outlined"
                        />
                    </Box>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                size: 120,
                cell: (info) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar producto">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(info.row.original)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar producto">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleOpenDelete(info.row.original.id)}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            }),
        ],
        []
    )

    // Configuración de la tabla
    const table = useReactTable({
        data: products,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
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
    }

    // Obtener categorías únicas
    const uniqueCategories = useMemo(() => {
        return [...new Set(products.map(p => p.category))].filter(Boolean)
    }, [products])

    // Obtener géneros únicos
    const uniqueGenders = useMemo(() => {
        return [...new Set(products.map(p => p.gender))].filter(Boolean)
    }, [products])

    // Dialog: New/Edit Product
    const handleOpenDialog = (product?: Product) => {
        setSuccess(null)
        setError(null)
        if (product) {
            setEditingProduct(product)
            // Load product for edit
            getProduct(product.id).then((res) => {
                const p = res.data

                // Limpiar URLs de imágenes al cargar el producto
                const cleanImages = p.images && Array.isArray(p.images)
                    ? p.images.map((url: string) => url.replace('/index.php/', '/'))
                    : []

                reset({
                    name: p.name,
                    description: p.description,
                    category: p.category,
                    gender: p.gender,
                    price: p.price,
                    images: cleanImages,
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

            {/* Controles de filtros y búsqueda */}
            <Paper sx={{ p: 2, mb: 2, mt: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        placeholder="Buscar productos..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 250 }}
                        slotProps={{
                            input: {
                                startAdornment: <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
                            }
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value)
                                table.getColumn('category')?.setFilterValue(e.target.value || undefined)
                            }}
                            label="Categoría"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {uniqueCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Género</InputLabel>
                        <Select
                            value={genderFilter}
                            onChange={(e) => {
                                setGenderFilter(e.target.value)
                                table.getColumn('gender')?.setFilterValue(e.target.value || undefined)
                            }}
                            label="Género"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {uniqueGenders.map((gender) => (
                                <MenuItem key={gender} value={gender}>
                                    {gender === 'hombre' ? 'Hombre' : gender === 'mujer' ? 'Mujer' : 'Unisex'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ ml: 'auto' }}>
                        <Typography variant="body2" color="text.secondary">
                            {table.getFilteredRowModel().rows.length} de {products.length} productos
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Tabla con TanStack React Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            sx={{
                                                width: header.getSize(),
                                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                userSelect: 'none',
                                            }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {header.isPlaceholder ? null : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Box display="flex" flexDirection="column">
                                                        {header.column.getIsSorted() === 'asc' && (
                                                            <ArrowUpward fontSize="small" />
                                                        )}
                                                        {header.column.getIsSorted() === 'desc' && (
                                                            <ArrowDownward fontSize="small" />
                                                        )}
                                                        {!header.column.getIsSorted() && (
                                                            <ArrowUpward
                                                                fontSize="small"
                                                                sx={{ opacity: 0.3 }}
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={table.getVisibleLeafColumns().length} align="center">
                                        <Typography variant="body2" color="text.secondary" py={4}>
                                            {globalFilter || categoryFilter || genderFilter
                                                ? 'No se encontraron productos con los filtros aplicados'
                                                : 'No hay productos registrados'
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" color="text.secondary">
                            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                            >
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <MenuItem key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            por página
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Primera
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Siguiente
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            Última
                        </Button>
                    </Stack>
                </Box>
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
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'El nombre es obligatorio' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nombre del producto"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'La descripción es obligatoria' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        multiline
                                        rows={3}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'La categoría es obligatoria' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Categoría"
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                            fullWidth
                                        />
                                    )}
                                />

                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: 'El género es obligatorio' }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.gender}>
                                            <InputLabel>Género</InputLabel>
                                            <Select {...field} label="Género">
                                                <MenuItem value="hombre">Hombre</MenuItem>
                                                <MenuItem value="mujer">Mujer</MenuItem>
                                                <MenuItem value="unisex">Unisex</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />

                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: 'El precio es obligatorio', min: 0 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="Precio (€)"
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
                                            fullWidth
                                            slotProps={{
                                                htmlInput: { step: 0.01 }
                                            }}
                                        />
                                    )}
                                />
                            </Stack>

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

                            <Typography variant="h6">Stock por talla y color</Typography>
                            {stockFields.map((field, index) => (
                                <Stack key={field.id} direction="row" spacing={2} alignItems="center">
                                    <Controller
                                        name={`stocks.${index}.size_id`}
                                        control={control}
                                        rules={{ required: 'Selecciona una talla' }}
                                        render={({ field }) => (
                                            <FormControl sx={{ minWidth: 120 }}>
                                                <InputLabel>Talla</InputLabel>
                                                <Select {...field} label="Talla">
                                                    {sizes.map((size) => (
                                                        <MenuItem key={size.id} value={size.id}>
                                                            {size.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />

                                    <Controller
                                        name={`stocks.${index}.color_id`}
                                        control={control}
                                        rules={{ required: 'Selecciona un color' }}
                                        render={({ field }) => (
                                            <FormControl sx={{ minWidth: 120 }}>
                                                <InputLabel>Color</InputLabel>
                                                <Select {...field} label="Color">
                                                    {colors.map((color) => (
                                                        <MenuItem key={color.id} value={color.id}>
                                                            {color.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />

                                    <Controller
                                        name={`stocks.${index}.stock`}
                                        control={control}
                                        rules={{ required: 'El stock es obligatorio', min: 0 }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Stock"
                                                slotProps={{
                                                    htmlInput: { min: 0 }
                                                }}
                                                sx={{ width: 100 }}
                                            />
                                        )}
                                    />

                                    <IconButton
                                        color="error"
                                        onClick={() => removeStock(index)}
                                        disabled={stockFields.length === 1}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            ))}

                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => appendStock({ size_id: '', color_id: '', stock: 0 })}
                            >
                                Agregar variación
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
                        {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
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
