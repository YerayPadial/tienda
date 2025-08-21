import { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    TablePagination,
    Tooltip,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Card,
    CardContent
} from '@mui/material'
import {
    Edit,
    Delete,
    Search,
    CalendarToday,
    ArrowUpward,
    ArrowDownward,
    ShoppingCart,
    Euro,
    Add,
    Remove
} from '@mui/icons-material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    createColumnHelper,
    flexRender,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type PaginationState
} from '@tanstack/react-table'
import {
    getOrders,
    updateOrder,
    updateOrderItems,
    deleteOrder,
    getOrder,
    getProducts,
    getSizes,
    getColors
} from '../services/api'

type OrderItem = {
    id?: number
    product_id: number
    size_id: number
    color_id: number
    quantity: number
    product?: {
        id: number
        name: string
        price: number
    }
    size?: {
        id: number
        name: string
    }
    color?: {
        id: number
        name: string
    }
}

type Order = {
    id: number
    user_id: number
    status: 'procesando' | 'en_camino' | 'entregado'
    shipping_type: string
    shipping_data: any
    payment_completed: boolean
    ticket_path: string | null
    created_at: string
    updated_at: string
    calculated_total: string
    items_count: number
    user: {
        id: number
        name: string
        email: string
    }
    items: OrderItem[]
}

type OrderFormData = {
    status: 'procesando' | 'en_camino' | 'entregado'
    items: {
        id?: number
        product_id: number | string
        size_id: number | string
        color_id: number | string
        quantity: number
    }[]
}

const columnHelper = createColumnHelper<Order>()

const statusConfig = {
    procesando: { label: 'Procesando', color: '#FFA726', bgColor: '#FFF8E1' },
    en_camino: { label: 'En Camino', color: '#42A5F5', bgColor: '#E3F2FD' },
    entregado: { label: 'Entregado', color: '#66BB6A', bgColor: '#E8F5E8' }
}

export default function OrderManagement() {
    // Estados principales
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [sizes, setSizes] = useState<any[]>([])
    const [colors, setColors] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Estados del diálogo
    const [openDialog, setOpenDialog] = useState(false)
    const [editingOrder, setEditingOrder] = useState<Order | null>(null)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    // Estados de la tabla
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [totalRows, setTotalRows] = useState(0)

    // Formulario
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<OrderFormData>({
        defaultValues: {
            status: 'procesando',
            items: []
        }
    })

    // Field array para items
    const {
        fields: itemFields,
        append: appendItem,
        remove: removeItem
    } = useFieldArray({
        control,
        name: 'items'
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
            columnHelper.accessor('user.name', {
                header: 'Cliente',
                cell: (info) => (
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {info.getValue()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {info.row.original.user.email}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('status', {
                header: 'Estado',
                cell: (info) => {
                    const status = info.getValue()
                    const config = statusConfig[status] || {
                        label: status || 'Desconocido',
                        color: '#757575',
                        bgColor: '#F5F5F5'
                    }
                    return (
                        <Chip
                            label={config.label}
                            size="small"
                            sx={{
                                backgroundColor: config.bgColor,
                                color: config.color,
                                fontWeight: 500,
                                border: `2px solid ${config.color}`
                            }}
                        />
                    )
                },
            }),
            columnHelper.accessor('items_count', {
                header: 'Items',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <ShoppingCart color="action" fontSize="small" />
                        <Typography variant="body2">
                            {info.getValue()} items
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('calculated_total', {
                header: 'Total',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Euro color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight={500} color="primary">
                            €{info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('payment_completed', {
                header: 'Pago',
                cell: (info) => (
                    <Chip
                        label={info.getValue() ? 'Pagado' : 'Pendiente'}
                        size="small"
                        color={info.getValue() ? 'success' : 'warning'}
                        variant="outlined"
                    />
                ),
            }),
            columnHelper.accessor('created_at', {
                header: 'Fecha',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday color="action" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                            {new Date(info.getValue()).toLocaleDateString('es-ES')}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                size: 120,
                cell: (info) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar pedido">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(info.row.original)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar pedido">
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
        data: orders,
        columns,
        pageCount: Math.ceil(totalRows / pagination.pageSize),
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
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    // Cargar datos
    const fetchOrders = async (isInitial = false) => {
        if (isInitial) {
            setInitialLoading(true)
        } else {
            setLoading(true)
        }

        try {
            const params = {
                page: pagination.pageIndex + 1,
                perPage: pagination.pageSize,
                search: globalFilter,
                status: statusFilter,
                sortBy: sorting[0]?.id || 'created_at',
                sortOrder: (sorting[0]?.desc ? 'desc' : 'asc') as 'asc' | 'desc',
            }

            const response = await getOrders(params)
            setOrders(response.data || [])
            setTotalRows(response.pagination?.total || 0)
            setError(null)
        } catch (err: any) {
            setError('Error al cargar pedidos')
            setOrders([])
        }

        if (isInitial) {
            setInitialLoading(false)
        } else {
            setLoading(false)
        }
    }

    // Cargar datos auxiliares
    const fetchAuxiliaryData = async () => {
        try {
            const [productsRes, sizesRes, colorsRes] = await Promise.all([
                getProducts(),
                getSizes(),
                getColors()
            ])

            setProducts(productsRes.data || productsRes || [])
            setSizes(sizesRes.data || sizesRes || [])
            setColors(colorsRes.data || colorsRes || [])
        } catch (err) {
            console.error('Error loading auxiliary data:', err)
        }
    }

    // Efectos
    useEffect(() => {
        // Carga inicial
        fetchOrders(true)
        fetchAuxiliaryData()
    }, [])

    useEffect(() => {
        // Cargas posteriores (sin mostrar spinner inicial)
        if (!initialLoading) {
            fetchOrders()
        }
    }, [pagination, sorting, globalFilter, statusFilter, initialLoading])

    // Handlers del diálogo
    const handleOpenDialog = async (order: Order) => {
        setSuccess(null)
        setError(null)
        setEditingOrder(order)

        try {
            const response = await getOrder(order.id)
            const orderData = response.data

            reset({
                status: orderData.status,
                items: orderData.items.map((item: OrderItem) => ({
                    id: item.id,
                    product_id: item.product_id,
                    size_id: item.size_id,
                    color_id: item.color_id,
                    quantity: item.quantity
                }))
            })
        } catch (err) {
            setError('Error al cargar datos del pedido')
        }
        setOpenDialog(true)
    }

    const handleOpenDelete = (id: number) => {
        setDeleteId(id)
        setDeleteDialog(true)
    }

    // Submit del formulario
    const onSubmit = async (data: OrderFormData) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (editingOrder) {
                // Actualizar estado del pedido
                await updateOrder(editingOrder.id, {
                    status: data.status
                })

                // Actualizar items del pedido
                const itemsData = {
                    items: data.items.map(item => ({
                        id: item.id,
                        product_id: Number(item.product_id),
                        size_id: Number(item.size_id),
                        color_id: Number(item.color_id),
                        quantity: Number(item.quantity)
                    }))
                }

                await updateOrderItems(editingOrder.id, itemsData)
                setSuccess('Pedido actualizado correctamente')
            }
            setOpenDialog(false)
            fetchOrders()
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error al guardar el pedido'
            )
        }
        setLoading(false)
    }

    // Eliminar pedido
    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        try {
            if (deleteId) {
                await deleteOrder(deleteId)
                setSuccess('Pedido eliminado correctamente')
                fetchOrders()
            }
            setDeleteDialog(false)
        } catch (err: any) {
            setError('Error al eliminar el pedido')
        }
        setLoading(false)
    }

    const handleAddItem = () => {
        appendItem({
            product_id: '',
            size_id: '',
            color_id: '',
            quantity: 1
        })
    }

    const handleRemoveItem = (index: number) => {
        removeItem(index)
    }

    return (
        <Box p={3}>
            {/* Carga inicial */}
            {initialLoading ? (
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
                        Cargando pedidos...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" fontWeight={700}>
                            Gestión de Pedidos
                        </Typography>
                    </Stack>

                    {/* Alertas */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* Filtros */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                            <Box sx={{ flex: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar por ID de pedido, nombre o email del cliente..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Estado"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="procesando">Procesando</MenuItem>
                                        <MenuItem value="en_camino">En Camino</MenuItem>
                                        <MenuItem value="entregado">Entregado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Tabla */}
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
                                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                        userSelect: 'none'
                                                    }}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <Box>
                                                                {header.column.getIsSorted() === 'desc' ? (
                                                                    <ArrowDownward fontSize="small" />
                                                                ) : header.column.getIsSorted() === 'asc' ? (
                                                                    <ArrowUpward fontSize="small" />
                                                                ) : null}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">
                                                <Typography>Cargando...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">
                                                <Typography color="textSecondary">
                                                    No se encontraron pedidos
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
                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={pagination.pageIndex}
                            onPageChange={(_, newPage) =>
                                setPagination(prev => ({ ...prev, pageIndex: newPage }))
                            }
                            rowsPerPage={pagination.pageSize}
                            onRowsPerPageChange={(e) =>
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: parseInt(e.target.value, 10),
                                    pageIndex: 0
                                }))
                            }
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                        />
                    </Paper>

                    {/* Diálogo Editar */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="lg"
                        fullWidth
                    >
                        <DialogTitle>
                            Editar Pedido #{editingOrder?.id}
                        </DialogTitle>
                        <DialogContent>
                            <form id="order-form" onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3} sx={{ mt: 1 }}>
                                    {/* Estado del pedido */}
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: 'El estado es obligatorio' }}
                                        render={({ field }) => (
                                            <FormControl fullWidth error={!!errors.status}>
                                                <InputLabel>Estado del Pedido</InputLabel>
                                                <Select
                                                    {...field}
                                                    label="Estado del Pedido"
                                                >
                                                    <MenuItem value="procesando">
                                                        <Chip
                                                            label="Procesando"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: statusConfig.procesando.bgColor,
                                                                color: statusConfig.procesando.color,
                                                                border: `2px solid ${statusConfig.procesando.color}`
                                                            }}
                                                        />
                                                    </MenuItem>
                                                    <MenuItem value="en_camino">
                                                        <Chip
                                                            label="En Camino"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: statusConfig.en_camino.bgColor,
                                                                color: statusConfig.en_camino.color,
                                                                border: `2px solid ${statusConfig.en_camino.color}`
                                                            }}
                                                        />
                                                    </MenuItem>
                                                    <MenuItem value="entregado">
                                                        <Chip
                                                            label="Entregado"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: statusConfig.entregado.bgColor,
                                                                color: statusConfig.entregado.color,
                                                                border: `2px solid ${statusConfig.entregado.color}`
                                                            }}
                                                        />
                                                    </MenuItem>
                                                </Select>
                                                {errors.status && (
                                                    <Typography variant="caption" color="error">
                                                        {errors.status.message}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        )}
                                    />

                                    <Divider />

                                    {/* Items del pedido */}
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="h6">Items del Pedido</Typography>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={handleAddItem}
                                                size="small"
                                            >
                                                Agregar Item
                                            </Button>
                                        </Stack>

                                        {itemFields.map((field, index) => (
                                            <Card key={field.id} sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Stack spacing={2}>
                                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Controller
                                                                    name={`items.${index}.product_id`}
                                                                    control={control}
                                                                    rules={{ required: 'Selecciona un producto' }}
                                                                    render={({ field }) => (
                                                                        <FormControl fullWidth>
                                                                            <InputLabel>Producto</InputLabel>
                                                                            <Select
                                                                                {...field}
                                                                                label="Producto"
                                                                            >
                                                                                {products.map((product) => (
                                                                                    <MenuItem key={product.id} value={product.id}>
                                                                                        {product.name} - €{product.price}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </Box>
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <Controller
                                                                    name={`items.${index}.size_id`}
                                                                    control={control}
                                                                    rules={{ required: 'Selecciona una talla' }}
                                                                    render={({ field }) => (
                                                                        <FormControl fullWidth>
                                                                            <InputLabel>Talla</InputLabel>
                                                                            <Select
                                                                                {...field}
                                                                                label="Talla"
                                                                            >
                                                                                {sizes.map((size) => (
                                                                                    <MenuItem key={size.id} value={size.id}>
                                                                                        {size.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </Box>
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <Controller
                                                                    name={`items.${index}.color_id`}
                                                                    control={control}
                                                                    rules={{ required: 'Selecciona un color' }}
                                                                    render={({ field }) => (
                                                                        <FormControl fullWidth>
                                                                            <InputLabel>Color</InputLabel>
                                                                            <Select
                                                                                {...field}
                                                                                label="Color"
                                                                            >
                                                                                {colors.map((color) => (
                                                                                    <MenuItem key={color.id} value={color.id}>
                                                                                        {color.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </Box>
                                                            <Box sx={{ minWidth: 100 }}>
                                                                <Controller
                                                                    name={`items.${index}.quantity`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: 'La cantidad es obligatoria',
                                                                        min: { value: 1, message: 'Mínimo 1' }
                                                                    }}
                                                                    render={({ field }) => (
                                                                        <TextField
                                                                            {...field}
                                                                            label="Cantidad"
                                                                            type="number"
                                                                            fullWidth
                                                                            inputProps={{ min: 1 }}
                                                                        />
                                                                    )}
                                                                />
                                                            </Box>
                                                            <Box>
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    disabled={itemFields.length === 1}
                                                                >
                                                                    <Remove />
                                                                </IconButton>
                                                            </Box>
                                                        </Stack>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Stack>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                form="order-form"
                                variant="contained"
                                disabled={loading}
                            >
                                Actualizar Pedido
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo Eliminar */}
                    <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                        <DialogTitle>Eliminar Pedido</DialogTitle>
                        <DialogContent>
                            <Typography>
                                ¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialog(false)}>
                                Cancelar
                            </Button>
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
                </>
            )}
        </Box>
    )
}
