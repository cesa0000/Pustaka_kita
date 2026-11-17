<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create(['name' => 'Admin Perpustakaan', 'email' => 'admin@perpus.test', 'password' => 'password', 'role' => 'admin']);
        User::create(['name' => 'Cesa Customer', 'email' => 'customer@perpus.test', 'password' => 'password', 'role' => 'customer']);

        $cats = collect(['Pemrograman', 'Basis Data', 'Desain', 'Novel', 'Sains'])
            ->mapWithKeys(fn ($n) => [$n => Category::create(['name' => $n])->id]);

        $books = [
            ['Laravel untuk Pemula', 'Budi Santoso', 2023, 'Pemrograman', 5],
            ['Belajar React JS', 'Rina Wijaya', 2024, 'Pemrograman', 4],
            ['PHP Dasar hingga Mahir', 'Andi Pratama', 2021, 'Pemrograman', 3],
            ['MySQL Praktis', 'Dewi Lestari', 2022, 'Basis Data', 6],
            ['Desain Basis Data Relasional', 'Hadi Kurniawan', 2020, 'Basis Data', 2],
            ['Dasar-dasar UI/UX', 'Sari Anggraini', 2023, 'Desain', 4],
            ['Bumi Manusia', 'Pramoedya Ananta Toer', 1980, 'Novel', 3],
            ['Laskar Pelangi', 'Andrea Hirata', 2005, 'Novel', 5],
            ['Sejarah Singkat Waktu', 'Stephen Hawking', 1988, 'Sains', 2],
        ];

        foreach ($books as [$title, $author, $year, $cat, $stock]) {
            Book::create([
                'category_id' => $cats[$cat],
                'title' => $title,
                'author' => $author,
                'year' => $year,
                'description' => "Buku {$title} karya {$author}.",
                'stock' => $stock,
            ]);
        }
    }
}
