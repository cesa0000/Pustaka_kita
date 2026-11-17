import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api'

export default function MyBorrowings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/borrowings')
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const isOverdue = (b) => b.status === 'borrowed' && b.due_date < new Date().toISOString().slice(0, 10)

  return (
    <>
      <h1 className="h2 mb-3">Pinjaman saya</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <p>Memuat...</p> : items.length === 0 ? (
        <p>Anda belum meminjam buku. Buka katalog untuk mulai meminjam.</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>Buku</th><th>Dipinjam</th><th>Batas kembali</th><th>Status</th></tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.book.title}</td>
                  <td>{b.borrowed_at}</td>
                  <td>{b.due_date}</td>
                  <td>
                    {b.status === 'returned'
                      ? <span className="badge text-bg-secondary">Dikembalikan {b.returned_at}</span>
                      : isOverdue(b)
                        ? <span className="badge text-bg-danger">Terlambat</span>
                        : <span className="badge text-bg-success">Dipinjam</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
