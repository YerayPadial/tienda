import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    AppBar,
    Box,
    Drawer,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    CssBaseline
} from '@mui/material'
import {
    Menu as MenuIcon,
    Dashboard,
    People,
    Inventory,
    ShoppingCart,
    AccountCircle,
    ExitToApp,
    PersonAdd,
    Store
} from '@mui/icons-material'
import { useEmployee } from '../context/EmployeeContext'

const drawerWidth = 240

interface AdminLayoutProps {
    children?: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { employee, logout } = useEmployee()

    const [mobileOpen, setMobileOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleProfileMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = async () => {
        handleProfileMenuClose()
        await logout()
        navigate('/admin/login')
    }

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <Dashboard />,
            path: '/admin/dashboard'
        },
        {
            text: 'Empleados',
            icon: <PersonAdd />,
            path: '/admin/employees'
        },
        {
            text: 'Productos',
            icon: <Inventory />,
            path: '/admin/products'
        },
        {
            text: 'Clientes',
            icon: <People />,
            path: '/admin/clients'
        },
        {
            text: 'Pedidos',
            icon: <ShoppingCart />,
            path: '/admin/orders'
        },
    ]

    const drawer = (
        <div>
            <Toolbar>
                <Box display="flex" alignItems="center" gap={1}>
                    <Store color="primary" />
                    <Typography variant="h6" noWrap component="div">
                        Admin Panel
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Panel Administrativo - Tienda
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {employee?.name}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    {employee?.name}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Cerrar Sesión
                </MenuItem>
            </Menu>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}

export default AdminLayout
