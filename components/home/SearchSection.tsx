"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

interface SearchSectionProps {
    lang: string;
    t: {
        searchPlaceholder: string;
        locationPlaceholder: string;
        searchButton: string;
        popularSearches: string;
    };
}

export default function SearchSection({ lang, t }: SearchSectionProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search initiated:", { query, location, lang });

        setIsSearching(true);

        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (location) params.set("location", location);

        const url = `/${lang}/jobs?${params.toString()}`;
        console.log("Navigating to:", url);
        router.push(url);
    };

    return (
        <div className="mt-10">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:bg-white sm:p-2 sm:rounded-lg sm:shadow-lg">
                <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:bg-transparent sm:py-2 sm:ring-0 sm:focus:ring-0"
                        placeholder={t.searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="hidden sm:block sm:h-8 sm:w-px sm:bg-gray-200"></div>

                <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:bg-transparent sm:py-2 sm:ring-0 sm:focus:ring-0"
                        placeholder={t.locationPlaceholder}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSearching ? "..." : t.searchButton}
                </button>
            </form>
            <p className="mt-4 text-sm text-blue-200">
                {t.popularSearches}
            </p>
        </div>
    );
}
