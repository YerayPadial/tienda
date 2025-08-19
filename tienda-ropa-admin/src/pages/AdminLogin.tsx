import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    Container,
    Avatar,
    CssBaseline
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { useEmployee } from '../context/EmployeeContext'

const AdminLogin: React.FC = () => {
    const navigate = useNavigate()
    const { login } = useEmployee()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Limpiar error al empezar a escribir
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await login(formData.email, formData.password)
            navigate('/admin/dashboard')
        } catch (err: any) {
            console.error('Error de login:', err)
            if (err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('Error de conexión. Intenta nuevamente.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlined />
                    </Avatar>

                    <Typography component="h1" variant="h4" gutterBottom>
                        Panel Administrativo
                    </Typography>

                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Acceso exclusivo para empleados
                    </Typography>

                    <Card sx={{ width: '100%', mt: 1 }}>
                        <CardContent>
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 3 }}>
                        © 2025 Tienda de Ropa - Panel Administrativo
                    </Typography>
                </Box>
            </Container>
        </>
    )
}

export default AdminLogin
