<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;

class StatsController extends Controller
{
    public function index()
    {
        return [
            'books' => Book::count(),
            'customers' => User::where('role', 'customer')->count(),
            'active_borrowings' => Borrowing::where('status', 'borrowed')->count(),
            'overdue' => Borrowing::where('status', 'borrowed')
                ->whereDate('due_date', '<', now()->toDateString())
                ->count(),
        ];
    }
}
