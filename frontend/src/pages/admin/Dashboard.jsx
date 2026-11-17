import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/stats').then((res) => setStats(res.data)).catch((err) => setError(errorMessage(err)))
  }, [])

  const cards = stats && [
    { label: 'Judul buku', value: stats.books },
    { label: 'Anggota', value: stats.customers },
    { label: 'Sedang dipinjam', value: stats.active_borrowings },
    { label: 'Terlambat', value: stats.overdue, warn: true },
  ]

  return (
    <>
      <h1 className="h2 mb-3">Dashboard admin</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {!stats && !error && <p>Memuat...</p>}
      <div className="row g-3 mb-4">
        {cards?.map((c) => (
          <div className="col-6 col-lg-3" key={c.label}>
            <div className={`stat ${c.warn ? 'warn' : ''}`}>
              <div className="num">{c.value}</div>
              <div className="text-secondary">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/admin/books" className="btn btn-pine">Kelola buku</Link>
        <Link to="/admin/borrowings" className="btn btn-outline-dark">Lihat peminjaman</Link>
      </div>
    </>
  )
}
