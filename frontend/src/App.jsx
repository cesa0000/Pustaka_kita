import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBorrowings from './pages/MyBorrowings'
import Dashboard from './pages/admin/Dashboard'
import Books from './pages/admin/Books'
import Borrowings from './pages/admin/Borrowings'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-borrowings" element={<ProtectedRoute role="customer"><MyBorrowings /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute role="admin"><Books /></ProtectedRoute>} />
          <Route path="/admin/borrowings" element={<ProtectedRoute role="admin"><Borrowings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
