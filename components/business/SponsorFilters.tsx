"use client";

import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface SponsorFiltersProps {
    lang: string;
    initialQuery: string;
    initialCountry: string;
    t: {
        searchPlaceholder: string;
        searchButton: string;
        filters: {
            all: string;
            uk: string;
            ie: string;
            nl: string;
            de: string;
            fr: string;
            se: string;
        };
    };
}

export default function SponsorFilters({ lang, initialQuery, initialCountry, t }: SponsorFiltersProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(initialQuery);
    const [country, setCountry] = useState(initialCountry);

    const countries = [
        { code: "ALL", label: t.filters.all, flag: "🌍" },
        { code: "UK", label: t.filters.uk, flag: "🇬🇧" },
        { code: "IE", label: t.filters.ie, flag: "🇮🇪" },
        { code: "NL", label: t.filters.nl, flag: "🇳🇱" },
        { code: "DE", label: t.filters.de, flag: "🇩🇪" },
        { code: "FR", label: t.filters.fr, flag: "🇫🇷" },
        { code: "SE", label: t.filters.se, flag: "🇸🇪" },
    ];

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        startTransition(() => {
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (country && country !== "ALL") params.set("country", country);
            params.set("page", "1"); // Reset to page 1 on filter change

            router.push(`/${lang}/sponsors?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-grow max-w-lg">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
            </div>

            <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                    name="country"
                    value={country}
                    onChange={(e) => {
                        setCountry(e.target.value);
                        // Optional: Auto-submit on select change
                        // We can't call handleSearch directly easily because of state update lag, 
                        // but we can construct URL directly here or use useEffect.
                        // For simplicity, let's just update state and let user click Search, 
                        // OR we can trigger a transition directly.
                    }}
                    className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white pl-9 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                    {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.flag} {c.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
                {isPending ? "..." : t.searchButton}
            </button>
        </form>
    );
}
