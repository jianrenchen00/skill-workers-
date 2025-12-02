import { createClient } from "@/lib/supabase/server";
import { Search, Filter } from "lucide-react";
import SponsorFilters from "@/components/business/SponsorFilters";

export default async function SponsorsPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ q?: string; page?: string; country?: string }>;
}) {
    const { lang } = await params;
    const { q, page, country } = await searchParams;
    const query = q || "";
    const currentPage = Number(page) || 1;
    const currentCountry = country || "ALL";
    const pageSize = 20;

    const supabase = await createClient();

    // Use the RPC function for advanced sorting
    const { data, error } = await supabase.rpc('get_sponsors_sorted', {
        search_query: query,
        page_number: currentPage,
        page_size: pageSize,
        country_filter: currentCountry === "ALL" ? null : currentCountry
    });

    if (error) {
        console.error("Error fetching sponsors:", error);
    }

    // Extract count from the first row (if exists)
    const count = data && data.length > 0 ? Number(data[0].total_count) : 0;
    const sponsors = data || [];
    const totalPages = Math.ceil(count / pageSize);

    const t = {
        en: {
            title: "Visa Sponsor List",
            subtitle: "Search the official register of licensed sponsors in Western Europe.",
            searchPlaceholder: "Search by company name...",
            searchButton: "Search",
            headers: {
                name: "Organisation Name",
                city: "Town/City",
                rating: "Type & Rating",
                route: "Route",
                country: "Country"
            },
            noResults: "No sponsors found matching your search.",
            filters: {
                all: "All Countries",
                uk: "UK",
                ie: "Ireland",
                nl: "Netherlands",
                de: "Germany",
                fr: "France",
                se: "Sweden"
            }
        },
        zh: {
            title: "工签资质公司名单",
            subtitle: "查询西欧各国官方注册的签证赞助商名录。",
            searchPlaceholder: "搜索公司名称...",
            searchButton: "搜索",
            headers: {
                name: "公司名称",
                city: "城市",
                rating: "评级",
                route: "签证类型",
                country: "国家"
            },
            noResults: "未找到匹配的赞助商。",
            filters: {
                all: "所有国家",
                uk: "英国",
                ie: "爱尔兰",
                nl: "荷兰",
                de: "德国",
                fr: "法国",
                se: "瑞典"
            }
        },
    }[lang as "en" | "zh"] || {
        title: "Visa Sponsor List",
        subtitle: "Search the official register of licensed sponsors in Western Europe.",
        searchPlaceholder: "Search by company name...",
        searchButton: "Search",
        headers: {
            name: "Organisation Name",
            city: "Town/City",
            rating: "Type & Rating",
            route: "Route",
            country: "Country"
        },
        noResults: "No sponsors found matching your search.",
        filters: {
            all: "All Countries",
            uk: "UK",
            ie: "Ireland",
            nl: "Netherlands",
            de: "Germany",
            fr: "France",
            se: "Sweden"
        }
    };

    const getFlag = (code: string) => {
        const map: Record<string, string> = {
            'UK': '🇬🇧', 'IE': '🇮🇪', 'NL': '🇳🇱', 'DE': '🇩🇪', 'FR': '🇫🇷', 'SE': '🇸🇪'
        };
        return map[code] || '🇪🇺';
    };

    return (
        <div className="bg-zinc-50 min-h-screen dark:bg-black py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t.title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {t.subtitle}
                    </p>
                </div>

                {/* Search & Filter Form */}
                <SponsorFilters
                    lang={lang}
                    initialQuery={query}
                    initialCountry={currentCountry}
                    t={t}
                />

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {t.headers.name}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {t.headers.country}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {t.headers.city}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {t.headers.route}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {t.headers.rating}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {sponsors && sponsors.length > 0 ? (
                                    sponsors.map((sponsor: any) => (
                                        <tr key={sponsor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                {sponsor.organisation_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="text-lg mr-2">{getFlag(sponsor.country || 'UK')}</span>
                                                {sponsor.country || 'UK'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {sponsor.town_city}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {sponsor.route}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {sponsor.type_rating}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {t.noResults}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination (Simple) */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        {currentPage > 1 && (
                            <a
                                href={`?q=${query}&page=${currentPage - 1}&country=${currentCountry}`}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                Previous
                            </a>
                        )}
                        {currentPage < totalPages && (
                            <a
                                href={`?q=${query}&page=${currentPage + 1}&country=${currentCountry}`}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                Next
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
