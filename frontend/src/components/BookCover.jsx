const COLORS = ['#1f6f5c', '#16273b', '#8a3b2f', '#4a5d8f', '#6b4f7a', '#2f7a8a']

export default function BookCover({ book }) {
  return (
    <div className="cover" style={{ background: COLORS[book.id % COLORS.length] }}>
      <div className="cover-title">{book.title}</div>
      <div className="cover-author">{book.author}</div>
    </div>
  )
}
