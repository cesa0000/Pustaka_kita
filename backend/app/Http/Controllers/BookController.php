<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    private function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:200',
            'author' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . date('Y'),
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
        ];
    }

    // GET /books?q=&category_id=
    public function index(Request $request)
    {
        return Book::with('category')
            ->when($request->q, fn ($query, $q) => $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")->orWhere('author', 'like', "%{$q}%");
            }))
            ->when($request->category_id, fn ($query, $id) => $query->where('category_id', $id))
            ->latest()
            ->get();
    }

    public function show(Book $book)
    {
        return $book->load('category');
    }

    public function store(Request $request)
    {
        $book = Book::create($request->validate($this->rules()));

        return response()->json($book->load('category'), 201);
    }

    public function update(Request $request, Book $book)
    {
        $book->update($request->validate($this->rules()));

        return $book->load('category');
    }

    public function destroy(Book $book)
    {
        if ($book->borrowings()->where('status', 'borrowed')->exists()) {
            return response()->json(['message' => 'Buku masih dipinjam, tidak bisa dihapus.'], 422);
        }

        $book->delete();

        return response()->json(['message' => 'Buku dihapus.']);
    }
}
