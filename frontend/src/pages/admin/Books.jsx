import { useEffect, useState } from 'react'
import api, { errorMessage } from '../../api'

const EMPTY = { category_id: '', title: '', author: '', year: new Date().getFullYear(), description: '', stock: 1 }

export default function Books() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(null) // null = modal tertutup
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [modalError, setModalError] = useState('')

  const load = () =>
    api.get('/books').then((res) => setBooks(res.data)).catch((err) => setError(errorMessage(err)))

  useEffect(() => {
    load()
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  const openCreate = () => { setEditingId(null); setForm({ ...EMPTY, category_id: categories[0]?.id ?? '' }); setModalError('') }
  const openEdit = (b) => {
    setEditingId(b.id)
    setForm({ category_id: b.category_id, title: b.title, author: b.author, year: b.year, description: b.description ?? '', stock: b.stock })
    setModalError('')
  }
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    try {
      if (editingId) await api.put(`/books/${editingId}`, form)
      else await api.post('/books', form)
      setForm(null)
      load()
    } catch (err) {
      setModalError(errorMessage(err))
    }
  }

  const remove = async (b) => {
    if (!window.confirm(`Hapus buku "${b.title}"?`)) return
    try {
      await api.delete(`/books/${b.id}`)
      setError('')
      load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">Kelola buku</h1>
        <button className="btn btn-pine" onClick={openCreate}>Tambah buku</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr><th>Judul</th><th>Penulis</th><th>Kategori</th><th>Tahun</th><th>Stok</th><th className="text-end">Aksi</th></tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category?.name}</td>
                <td>{b.year}</td>
                <td>{b.stock}</td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-outline-dark me-1" onClick={() => openEdit(b)}>Ubah</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(b)}>Hapus</button>
                </td>
              </tr>
            ))}
            {books.length === 0 && <tr><td colSpan="6" className="text-center py-4">Belum ada buku. Klik "Tambah buku".</td></tr>}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="modal-backdrop-lite" role="dialog" aria-modal="true">
          <div className="card mx-auto" style={{ maxWidth: 520 }}>
            <form onSubmit={save} className="card-body p-4">
              <h2 className="h5 mb-3">{editingId ? 'Ubah buku' : 'Tambah buku'}</h2>
              {modalError && <div className="alert alert-danger py-2">{modalError}</div>}
              <div className="mb-3">
                <label className="form-label">Judul</label>
                <input className="form-control" required value={form.title} onChange={set('title')} />
              </div>
              <div className="mb-3">
                <label className="form-label">Penulis</label>
                <input className="form-control" required value={form.author} onChange={set('author')} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label">Kategori</label>
                  <select className="form-select" required value={form.category_id} onChange={set('category_id')}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-6 col-sm-3">
                  <label className="form-label">Tahun</label>
                  <input type="number" className="form-control" required value={form.year} onChange={set('year')} />
                </div>
                <div className="col-6 col-sm-3">
                  <label className="form-label">Stok</label>
                  <input type="number" min="0" className="form-control" required value={form.stock} onChange={set('stock')} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea rows="3" className="form-control" value={form.description} onChange={set('description')} />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-dark" onClick={() => setForm(null)}>Batal</button>
                <button className="btn btn-pine">Simpan buku</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
