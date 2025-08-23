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
    Avatar,
    CircularProgress
} from '@mui/material'
import {
    Add,
    Edit,
    Delete,
    ArrowUpward,
    ArrowDownward,
    Search,
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
    getProduct,
    createSize,
    createColor,
    deleteSize,
    deleteColor
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
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleteDialog, setDeleteDialog] = useState(false)

    // Estados para crear tallas y colores
    const [openSizeDialog, setOpenSizeDialog] = useState(false)
    const [openColorDialog, setOpenColorDialog] = useState(false)
    const [newSizeName, setNewSizeName] = useState('')
    const [newColorName, setNewColorName] = useState('')
    const [newColorHex, setNewColorHex] = useState('#000000')
    const [sizeError, setSizeError] = useState<string | null>(null)
    const [colorError, setColorError] = useState<string | null>(null)

    // Estados para eliminar tallas y colores
    const [deleteSizeDialog, setDeleteSizeDialog] = useState(false)
    const [deleteColorDialog, setDeleteColorDialog] = useState(false)
    const [sizeToDelete, setSizeToDelete] = useState<number | null>(null)
    const [colorToDelete, setColorToDelete] = useState<number | null>(null)

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
        fetchAll(true)
    }, [])

    const fetchAll = async (isInitial = false) => {
        if (isInitial) {
            setInitialLoading(true)
        } else {
            setLoading(true)
        }

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

        if (isInitial) {
            setInitialLoading(false)
        } else {
            setLoading(false)
        }
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

    // Abrir diálogo de crear talla
    const handleOpenSizeDialog = () => {
        setNewSizeName('')
        setSizeError(null)
        setOpenSizeDialog(true)
    }

    // Abrir diálogo de crear color
    const handleOpenColorDialog = () => {
        setNewColorName('')
        setNewColorHex('#000000')
        setColorError(null)
        setOpenColorDialog(true)
    }

    // Manejar cambio en nombre de talla
    const handleSizeNameChange = (value: string) => {
        setNewSizeName(value)
        if (sizeError) setSizeError(null)
    }

    // Manejar cambio en nombre de color
    const handleColorNameChange = (value: string) => {
        setNewColorName(value)
        if (colorError) setColorError(null)
    }

    // Manejar cambio en hex de color
    const handleColorHexChange = (value: string) => {
        setNewColorHex(value)
        if (colorError) setColorError(null)
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

    // Crear nueva talla
    const handleCreateSize = async () => {
        if (!newSizeName.trim()) {
            setSizeError('El nombre de la talla es obligatorio')
            return
        }

        // Validar que no existe ya la talla
        const existingSize = sizes.find(size =>
            size.name.toLowerCase().trim() === newSizeName.toLowerCase().trim()
        )
        if (existingSize) {
            setSizeError('Ya existe una talla con este nombre')
            return
        }

        setLoading(true)
        setSizeError(null)
        setError(null)
        try {
            const response = await createSize({ name: newSizeName.trim() })
            const newSize = response.data || response
            setSizes(prev => [...prev, newSize])
            setSuccess('Talla creada correctamente')
            setNewSizeName('')
            setOpenSizeDialog(false)
        } catch (err: any) {
            console.error('Error creating size:', err)
            // Manejar diferentes tipos de errores
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const errors = err.response.data.errors
                if (errors.name && errors.name[0]) {
                    setSizeError(errors.name[0])
                } else {
                    setSizeError('Error de validación en el formulario')
                }
            } else if (err.response?.data?.message) {
                setSizeError(err.response.data.message)
            } else {
                setSizeError('Error al crear la talla. Intenta de nuevo.')
            }
        }
        setLoading(false)
    }

    // Crear nuevo color
    const handleCreateColor = async () => {
        if (!newColorName.trim()) {
            setColorError('El nombre del color es obligatorio')
            return
        }

        // Validar que no existe ya el color
        const existingColor = colors.find(color =>
            color.name.toLowerCase().trim() === newColorName.toLowerCase().trim()
        )
        if (existingColor) {
            setColorError('Ya existe un color con este nombre')
            return
        }

        // Validar formato del color hex
        const hexPattern = /^#[a-fA-F0-9]{6}$/
        if (newColorHex && !hexPattern.test(newColorHex)) {
            setColorError('El código de color debe tener el formato #RRGGBB')
            return
        }

        setLoading(true)
        setColorError(null)
        setError(null)
        try {
            const response = await createColor({
                name: newColorName.trim(),
                hex: newColorHex
            })
            const newColor = response.data || response
            setColors(prev => [...prev, newColor])
            setSuccess('Color creado correctamente')
            setNewColorName('')
            setNewColorHex('#000000')
            setOpenColorDialog(false)
        } catch (err: any) {
            console.error('Error creating color:', err)
            // Manejar diferentes tipos de errores
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const errors = err.response.data.errors
                if (errors.name && errors.name[0]) {
                    setColorError(errors.name[0])
                } else if (errors.hex && errors.hex[0]) {
                    setColorError(errors.hex[0])
                } else {
                    setColorError('Error de validación en el formulario')
                }
            } else if (err.response?.data?.message) {
                setColorError(err.response.data.message)
            } else {
                setColorError('Error al crear el color. Intenta de nuevo.')
            }
        }
        setLoading(false)
    }

    // Abrir diálogo de eliminar talla
    const handleOpenDeleteSize = (sizeId: number) => {
        setSizeToDelete(sizeId)
        setDeleteSizeDialog(true)
    }

    // Abrir diálogo de eliminar color
    const handleOpenDeleteColor = (colorId: number) => {
        setColorToDelete(colorId)
        setDeleteColorDialog(true)
    }

    // Eliminar talla
    const handleDeleteSize = async () => {
        if (!sizeToDelete) return

        setLoading(true)
        setError(null)
        setSizeError(null)
        try {
            await deleteSize(sizeToDelete)
            setSizes(prev => prev.filter(size => size.id !== sizeToDelete))
            setSuccess('Talla eliminada correctamente')
            setDeleteSizeDialog(false)
            setSizeToDelete(null)
        } catch (err: any) {
            console.error('Error deleting size:', err)
            let errorMessage = 'Error al eliminar la talla'

            if (err.response?.status === 422) {
                // Error de validación (talla en uso)
                errorMessage = err.response.data?.message || 'No se puede eliminar la talla porque está siendo utilizada en productos existentes'
            } else if (err.response?.status === 404) {
                errorMessage = 'La talla no existe'
            } else if (err.response?.status === 500) {
                errorMessage = 'Error interno del servidor. Inténtalo de nuevo.'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            }

            setError(errorMessage)
            setDeleteSizeDialog(false)
            setSizeToDelete(null)
        }
        setLoading(false)
    }

    // Eliminar color
    const handleDeleteColor = async () => {
        if (!colorToDelete) return

        setLoading(true)
        setError(null)
        setColorError(null)
        try {
            await deleteColor(colorToDelete)
            setColors(prev => prev.filter(color => color.id !== colorToDelete))
            setSuccess('Color eliminado correctamente')
            setDeleteColorDialog(false)
            setColorToDelete(null)
        } catch (err: any) {
            console.error('Error deleting color:', err)
            let errorMessage = 'Error al eliminar el color'

            if (err.response?.status === 422) {
                // Error de validación (color en uso)
                errorMessage = err.response.data?.message || 'No se puede eliminar el color porque está siendo utilizado en productos existentes'
            } else if (err.response?.status === 404) {
                errorMessage = 'El color no existe'
            } else if (err.response?.status === 500) {
                errorMessage = 'Error interno del servidor. Inténtalo de nuevo.'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            }

            setError(errorMessage)
            setDeleteColorDialog(false)
            setColorToDelete(null)
        }
        setLoading(false)
    }

    // Mostrar spinner durante la carga inicial
    if (initialLoading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="50vh"
                gap={2}
            >
                <CircularProgress size={48} />
                <Typography variant="h6" color="textSecondary">
                    Cargando productos...
                </Typography>
            </Box>
        )
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
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
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
                                    rules={{
                                        required: 'El precio es obligatorio',
                                        min: {
                                            value: 0.01,
                                            message: 'El precio debe ser mayor a 0'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="Precio (€)"
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
                                            fullWidth
                                            slotProps={{
                                                htmlInput: {
                                                    step: 0.01,
                                                    min: 0
                                                }
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
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleOpenSizeDialog}
                                            title="Crear nueva talla"
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
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
                                                                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                                                                    <Typography sx={{ flexGrow: 1 }}>{size.name}</Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleOpenDeleteSize(size.id)
                                                                        }}
                                                                        title="Eliminar talla"
                                                                        sx={{ ml: 'auto' }}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Stack>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleOpenColorDialog}
                                            title="Crear nuevo color"
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
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
                                                                <Stack direction="row" spacing={1} alignItems="center" width="100%">
                                                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
                                                                        {color.hex && (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 16,
                                                                                    height: 16,
                                                                                    backgroundColor: color.hex,
                                                                                    border: '1px solid #ccc',
                                                                                    borderRadius: '2px'
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography>{color.name}</Typography>
                                                                    </Stack>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleOpenDeleteColor(color.id)
                                                                        }}
                                                                        title="Eliminar color"
                                                                        sx={{ ml: 'auto' }}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Stack>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        />
                                    </Stack>

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

            {/* Dialogo crear talla */}
            <Dialog open={openSizeDialog} onClose={() => setOpenSizeDialog(false)}>
                <DialogTitle>Crear nueva talla</DialogTitle>
                <DialogContent>
                    {sizeError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {sizeError}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre de la talla"
                        fullWidth
                        variant="outlined"
                        value={newSizeName}
                        onChange={(e) => handleSizeNameChange(e.target.value)}
                        placeholder="Ej: XS, S, M, L, XL, 36, 38, 40..."
                        error={!!sizeError}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSizeDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleCreateSize}
                        variant="contained"
                        disabled={loading || !newSizeName.trim()}
                    >
                        {loading ? 'Creando...' : 'Crear talla'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo crear color */}
            <Dialog open={openColorDialog} onClose={() => setOpenColorDialog(false)}>
                <DialogTitle>Crear nuevo color</DialogTitle>
                <DialogContent>
                    {colorError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {colorError}
                        </Alert>
                    )}
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            label="Nombre del color"
                            fullWidth
                            variant="outlined"
                            value={newColorName}
                            onChange={(e) => handleColorNameChange(e.target.value)}
                            placeholder="Ej: Rojo, Azul marino, Negro..."
                            error={!!colorError}
                        />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                label="Color (hex)"
                                type="color"
                                value={newColorHex}
                                onChange={(e) => handleColorHexChange(e.target.value)}
                                sx={{ width: 100 }}
                            />
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: newColorHex,
                                    border: '1px solid #ccc',
                                    borderRadius: 1
                                }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                Vista previa del color
                            </Typography>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenColorDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleCreateColor}
                        variant="contained"
                        disabled={loading || !newColorName.trim()}
                    >
                        {loading ? 'Creando...' : 'Crear color'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo eliminar talla */}
            <Dialog open={deleteSizeDialog} onClose={() => setDeleteSizeDialog(false)}>
                <DialogTitle>Eliminar talla</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar esta talla? Esta acción no se puede deshacer.
                        Si la talla está siendo utilizada en productos existentes, no podrá ser eliminada.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteSizeDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleDeleteSize}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo eliminar color */}
            <Dialog open={deleteColorDialog} onClose={() => setDeleteColorDialog(false)}>
                <DialogTitle>Eliminar color</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar este color? Esta acción no se puede deshacer.
                        Si el color está siendo utilizado en productos existentes, no podrá ser eliminado.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteColorDialog(false)}>Cancelar</Button>
                    <Button
                        onClick={handleDeleteColor}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
