# Pustaka Kita - Aplikasi Peminjaman Buku

Proyek untuk uji kompetensi Junior Web Developer.
Stack: **React JS (Vite) + Bootstrap** sebagai Front-End, **Laravel (REST API + Sanctum)** sebagai Back-End, **MySQL/MariaDB** sebagai database.

## Role dan fitur

| Role | Fitur |
|------|-------|
| Publik | Lihat katalog, cari judul/penulis, filter kategori |
| Customer | Daftar, masuk, pinjam buku (stok berkurang, batas 7 hari), lihat riwayat pinjaman |
| Admin | Masuk, dashboard statistik, CRUD buku, lihat semua peminjaman, tandai buku kembali (stok bertambah) |

Batasan masalah: belum ada denda, perpanjangan pinjaman, upload sampul buku, dan lupa kata sandi.

## Struktur proyek

```
perpus/
  laravel-overlay/   file Laravel yang ditimpa/ditambah ke project Laravel baru
  frontend/          project React (Vite)
```

## Cara menjalankan

Prasyarat: PHP 8.2+, Composer, Node.js 18+, MySQL/MariaDB (XAMPP/Laragon boleh).

### 1. Back-End
```bash
composer create-project laravel/laravel backend
cd backend
php artisan install:api          # memasang Sanctum + routes/api.php
```
Salin **isi** folder `laravel-overlay/` ke dalam folder `backend/` (timpa file yang sama:
`bootstrap/app.php`, `app/Models/User.php`, `routes/api.php`, `database/seeders/DatabaseSeeder.php`).

Buat database kosong `perpus_db` di phpMyAdmin, lalu edit `backend/.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=perpus_db
DB_USERNAME=root
DB_PASSWORD=
```
Jalankan:
```bash
php artisan migrate:fresh --seed
php artisan serve                # http://127.0.0.1:8000
```

### 2. Front-End
```bash
cd frontend
npm install
npm run dev                      # http://localhost:5173
```
Alamat API ada di `frontend/.env` (`VITE_API_URL`).

### Akun contoh
| Role | Email | Sandi |
|------|-------|-------|
| Admin | admin@perpus.test | password |
| Customer | customer@perpus.test | password |

## ERD

```
users (id, name, email, password, role[admin|customer])
categories (id, name)
books (id, category_id -> categories.id, title, author, year, description, stock)
borrowings (id, user_id -> users.id, book_id -> books.id, borrowed_at, due_date, returned_at, status[borrowed|returned])
```
Relasi: categories 1-N books, users 1-N borrowings, books 1-N borrowings.

## Endpoint API

| Method | URL | Akses |
|--------|-----|-------|
| POST | /api/register, /api/login | publik |
| GET | /api/books, /api/books/{id}, /api/categories | publik |
| GET | /api/me, POST /api/logout | login |
| GET | /api/borrowings | login (admin: semua, customer: milik sendiri) |
| POST | /api/borrowings | customer |
| POST/PUT/DELETE | /api/books | admin |
| PATCH | /api/borrowings/{id}/return | admin |
| GET | /api/stats | admin |

## Pemetaan ke 8 slide ujian

1. **Judul**: Pustaka Kita, aplikasi peminjaman buku.
2. **Ruang lingkup**: tabel role dan fitur + batasan masalah di atas.
3. **Database**: ERD di atas (bisa digambar ulang di dbdiagram.io atau draw.io).
4. **Struktur folder**: screenshot VS Code `frontend/src` dan `backend/app`, plus link GitHub.
5. **UI**: screenshot Katalog, Login/Register, Pinjaman Saya, Dashboard Admin, Kelola Buku.
6. **Potongan kode**: `AuthController@login` (Laravel) + `AuthContext.jsx` (`login` memanggil `api.post('/login')`, token disimpan, interceptor di `api.js` menambah header Bearer). Alternatif: CRUD di `BookController` + `admin/Books.jsx`.
7. **Live demo**: login admin -> tambah buku -> login customer -> pinjam -> login admin -> tandai kembali.
8. **Kesimpulan**: ide lanjutan: denda keterlambatan, upload sampul, notifikasi email, laporan PDF.

## Kaitan dengan unit kompetensi

- Implementasi UI: halaman React + Bootstrap responsif
- Pemrograman terstruktur dan best practices: pemisahan Controller/Model/Middleware, komponen React, validasi input
- Library/komponen pre-existing: Bootstrap, react-router-dom, axios, Sanctum, Eloquent
