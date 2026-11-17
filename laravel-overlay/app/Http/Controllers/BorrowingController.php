<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BorrowingController extends Controller
{
    // Admin melihat semua transaksi, customer hanya miliknya sendiri
    public function index(Request $request)
    {
        $user = $request->user();

        return Borrowing::with(['book', 'user:id,name,email'])
            ->when($user->role !== 'admin', fn ($q) => $q->where('user_id', $user->id))
            ->latest()
            ->get();
    }

    // Customer meminjam buku
    public function store(Request $request)
    {
        $data = $request->validate(['book_id' => 'required|exists:books,id']);
        $user = $request->user();

        return DB::transaction(function () use ($data, $user) {
            $book = Book::lockForUpdate()->find($data['book_id']);

            if ($book->stock < 1) {
                return response()->json(['message' => 'Stok buku habis.'], 422);
            }

            $alreadyBorrowed = Borrowing::where('user_id', $user->id)
                ->where('book_id', $book->id)
                ->where('status', 'borrowed')
                ->exists();

            if ($alreadyBorrowed) {
                return response()->json(['message' => 'Anda masih meminjam buku ini.'], 422);
            }

            $book->decrement('stock');

            $borrowing = Borrowing::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrowed_at' => now()->toDateString(),
                'due_date' => now()->addDays(7)->toDateString(),
            ]);

            return response()->json($borrowing->load('book'), 201);
        });
    }

    // Admin memproses pengembalian
    public function returnBook(Borrowing $borrowing)
    {
        if ($borrowing->status === 'returned') {
            return response()->json(['message' => 'Buku sudah dikembalikan.'], 422);
        }

        DB::transaction(function () use ($borrowing) {
            $borrowing->update([
                'status' => 'returned',
                'returned_at' => now()->toDateString(),
            ]);
            $borrowing->book()->increment('stock');
        });

        return $borrowing->load(['book', 'user:id,name,email']);
    }
}
