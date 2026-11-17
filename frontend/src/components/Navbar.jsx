import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const close = () => setOpen(false)
  const handleLogout = async () => {
    await logout()
    close()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-md navbar-perpus">
      <div className="container">
        <Link to="/" className="navbar-brand brand" onClick={close}>Pustaka Kita</Link>
        <button
          className="navbar-toggler border-0"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }} />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink end to="/" className="nav-link" onClick={close}>Katalog</NavLink></li>
            {user?.role === 'customer' && (
              <li className="nav-item"><NavLink to="/my-borrowings" className="nav-link" onClick={close}>Pinjaman Saya</NavLink></li>
            )}
            {user?.role === 'admin' && (
              <>
                <li className="nav-item"><NavLink end to="/admin" className="nav-link" onClick={close}>Dashboard</NavLink></li>
                <li className="nav-item"><NavLink to="/admin/books" className="nav-link" onClick={close}>Kelola Buku</NavLink></li>
                <li className="nav-item"><NavLink to="/admin/borrowings" className="nav-link" onClick={close}>Peminjaman</NavLink></li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 py-2 py-md-0">
            {user ? (
              <>
                <span className="text-white-50 small">{user.name}</span>
                <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Keluar</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light" onClick={close}>Masuk</Link>
                <Link to="/register" className="btn btn-sm btn-pine" onClick={close}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
