import { createClient } from "@/lib/supabase/server";
import JobCard from "@/components/business/JobCard";
import { Search, Filter } from "lucide-react";
import { Job } from "@/types";

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const supabase = await createClient();

    // Fetch jobs with company data
    const { data: jobs, error } = await supabase
        .from("jobs")
        .select(`
      *,
      company:companies(*)
    `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
    }

    const t = {
        en: {
            title: "Latest Opportunities",
            subtitle: "Find jobs that match your skills and visa requirements.",
            searchPlaceholder: "Search jobs...",
            filter: "Filters",
            noJobs: "No jobs found at the moment. Please check back later.",
        },
        zh: {
            title: "最新职位机会",
            subtitle: "发现匹配你技能和签证要求的工作。",
            searchPlaceholder: "搜索职位...",
            filter: "筛选",
            noJobs: "暂时没有找到职位。请稍后再来看看。",
        },
    }[lang as "en" | "zh"] || {
        title: "Latest Opportunities",
        subtitle: "Find jobs that match your skills and visa requirements.",
        searchPlaceholder: "Search jobs...",
        filter: "Filters",
        noJobs: "No jobs found at the moment. Please check back later.",
    };

    return (
        <div className="bg-zinc-50 min-h-screen dark:bg-black py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header & Filters */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t.title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                className="h-10 rounded-md border border-gray-300 bg-white pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                            <Filter className="h-4 w-4" />
                            {t.filter}
                        </button>
                    </div>
                </div>

                {/* Job List */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {jobs && jobs.length > 0 ? (
                        jobs.map((job) => (
                            <JobCard key={job.id} job={job as unknown as Job} lang={lang} />
                        ))
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">{t.noJobs}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
