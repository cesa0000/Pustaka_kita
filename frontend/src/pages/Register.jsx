import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { errorMessage } from '../api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-card card shadow-sm">
      <div className="card-body p-4">
        <h2 className="h4 mb-3">Daftar anggota baru</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Nama lengkap</label>
            <input id="name" className="form-control" required value={form.name} onChange={set('name')} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-control" required value={form.email} onChange={set('email')} />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Kata sandi (min. 6 karakter)</label>
            <input id="password" type="password" minLength={6} className="form-control" required value={form.password} onChange={set('password')} />
          </div>
          <button className="btn btn-pine w-100" disabled={busy}>{busy ? 'Memproses...' : 'Buat akun'}</button>
        </form>
        <p className="mt-3 mb-0 small">Sudah punya akun? <Link to="/login">Masuk</Link></p>
      </div>
    </div>
  )
}
