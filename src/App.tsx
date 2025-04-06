import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import HealthInsights from './pages/HealthInsights'
import Awareness from './pages/Awareness'
import Education from './pages/Education'
import FindDoctor from './pages/FindDoctor'
import Auth from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/health-insights" element={<HealthInsights />} />
              <Route path="/awareness" element={<Awareness />} />
              <Route path="/education" element={<Education />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App