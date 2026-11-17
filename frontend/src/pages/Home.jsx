import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'
import BookCover from '../components/BookCover'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null) // { type, text }

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  // Muat ulang katalog setiap pencarian/filter berubah (dengan jeda singkat)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.get('/books', { params: { q, category_id: categoryId } })
        .then((res) => setBooks(res.data))
        .catch((err) => setNotice({ type: 'danger', text: errorMessage(err) }))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [q, categoryId])

  const borrow = async (book) => {
    if (!user) return navigate('/login')
    try {
      await api.post('/borrowings', { book_id: book.id })
      setBooks(books.map((b) => (b.id === book.id ? { ...b, stock: b.stock - 1 } : b)))
      setNotice({ type: 'success', text: `"${book.title}" berhasil dipinjam. Batas kembali 7 hari.` })
    } catch (err) {
      setNotice({ type: 'danger', text: errorMessage(err) })
    }
  }

  return (
    <>
      <h1 className="h2 mb-1">Katalog buku</h1>
      <p className="text-secondary">Cari judul atau penulis, lalu pinjam langsung dari sini.</p>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input className="form-control" placeholder="Cari judul atau penulis" aria-label="Cari buku"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" aria-label="Filter kategori"
            value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Semua kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible`}>
          {notice.text}
          <button className="btn-close" aria-label="Tutup" onClick={() => setNotice(null)} />
        </div>
      )}

      {loading ? (
        <p>Memuat buku...</p>
      ) : books.length === 0 ? (
        <p>Tidak ada buku yang cocok. Coba kata kunci atau kategori lain.</p>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
          {books.map((book) => (
            <div className="col" key={book.id}>
              <BookCover book={book} />
              <div className="mt-2">
                <div className="small text-secondary">{book.category?.name} &middot; {book.year}</div>
                <div className="small mb-2">Stok: <strong>{book.stock}</strong></div>
                {user?.role !== 'admin' && (
                  <button className="btn btn-pine btn-sm w-100" disabled={book.stock < 1} onClick={() => borrow(book)}>
                    {book.stock < 1 ? 'Stok habis' : 'Pinjam buku'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
