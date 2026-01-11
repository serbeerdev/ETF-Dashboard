"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { useState, FormEvent } from "react";

export function Navbar() {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(search)}`;
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>ETF Dashboard</span>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search ETFs by symbol or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline">
            Discover
          </Link>
          <Link href="/compare" className="text-sm font-medium hover:underline">
            Compare
          </Link>
        </div>
      </div>
    </nav>
  );
}
