import { useEffect, useState } from 'react'
import api, { errorMessage } from '../../api'

export default function Borrowings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () =>
    api.get('/borrowings')
      .then((res) => setItems(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const markReturned = async (id) => {
    try {
      await api.patch(`/borrowings/${id}/return`)
      setError('')
      load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <h1 className="h2 mb-3">Data peminjaman</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <p>Memuat...</p> : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr><th>Anggota</th><th>Buku</th><th>Dipinjam</th><th>Batas kembali</th><th>Status</th><th className="text-end">Aksi</th></tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.user?.name}<div className="small text-secondary">{b.user?.email}</div></td>
                  <td>{b.book?.title}</td>
                  <td>{b.borrowed_at}</td>
                  <td>{b.due_date}</td>
                  <td>
                    {b.status === 'returned'
                      ? <span className="badge text-bg-secondary">Dikembalikan</span>
                      : b.due_date < today
                        ? <span className="badge text-bg-danger">Terlambat</span>
                        : <span className="badge text-bg-success">Dipinjam</span>}
                  </td>
                  <td className="text-end">
                    {b.status === 'borrowed' && (
                      <button className="btn btn-sm btn-pine" onClick={() => markReturned(b.id)}>Tandai kembali</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="6" className="text-center py-4">Belum ada transaksi peminjaman.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
