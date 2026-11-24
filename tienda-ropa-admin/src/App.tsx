import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { adminRouter } from './routes/AdminRouter'
import palette from '../../shared/palette.json'

const theme = createTheme({
  palette: {
    primary: { main: palette.ink, dark: palette.hover, contrastText: palette.paper },
    secondary: { main: palette.accent, contrastText: palette.paper },
    info: { main: '#536268' },
    background: { default: palette.canvas, paper: palette.paper },
    text: { primary: palette.ink, secondary: palette.muted },
    divider: palette.line,
    action: { hover: '#25221f0a', selected: '#74523b1c' },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.035em' },
    h5: { fontWeight: 600, letterSpacing: '-0.025em' },
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { borderBottom: `1px solid ${palette.line}` } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 650 } },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { '&.Mui-focusVisible': { outline: `2px solid ${palette.focus}`, outlineOffset: 2 } },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: palette.canvas } },
    },
    MuiListItemButton: {
      styleOverrides: { root: { '&.Mui-selected .MuiListItemIcon-root': { color: palette.accent } } },
    },
    MuiTableCell: {
      styleOverrides: { head: { backgroundColor: palette.sand, fontWeight: 650 } },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={adminRouter} />
    </ThemeProvider>
  )
}

export default App
