import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { errorMessage } from '../api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-card card shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Masuk ke akun Anda</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-control" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Kata sandi</label>
            <input id="password" type="password" className="form-control" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-pine w-100" disabled={busy}>{busy ? 'Memproses...' : 'Masuk'}</button>
        </form>
        <p className="mt-3 mb-0 small">Belum punya akun? <Link to="/register">Daftar sebagai anggota</Link></p>
      </div>
    </div>
  )
}
