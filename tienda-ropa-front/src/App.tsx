import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Header from './components/Header'
import { UserProvider } from './context/UserContext'

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/tienda">
      <UserProvider>
        <div className="bg-gray-50 min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <AppRoutes />
          </main>
        </div>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App