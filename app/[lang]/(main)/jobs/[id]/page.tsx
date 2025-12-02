import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Building2, Clock, Banknote, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import WeChatShare from "@/components/jobs/WeChatShare";
import MatchScore from "@/components/jobs/JobMatchScore";

export default async function JobDetailsPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = await params;
    const supabase = await createClient();

    // 1. Fetch Job Details
    const { data: job, error } = await supabase
        .from("jobs")
        .select(`
      *,
      company:companies(*)
    `)
        .eq("id", id)
        .single();

    if (error || !job) {
        notFound();
    }

    // 2. Fetch User & Resume Insight (for Match Score)
    const { data: { user } } = await supabase.auth.getUser();
    let resumeInsight = null;

    if (user) {
        const { data: insight } = await supabase
            .from("resume_insights")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        resumeInsight = insight;
    }

    const t = {
        en: {
            back: "Back to Jobs",
            apply: "Apply Now",
            posted: "Posted on",
            salary: "Salary",
            type: "Job Type",
            location: "Location",
            description: "Job Description",
            requirements: "Requirements",
            share: "Share this Job",
            visa: "Visa Sponsorship Available",
        },
        zh: {
            back: "返回职位列表",
            apply: "立即申请",
            posted: "发布于",
            salary: "薪资",
            type: "工作类型",
            location: "工作地点",
            description: "职位描述",
            requirements: "职位要求",
            share: "分享职位",
            visa: "提供签证赞助",
        }
    }[lang as "en" | "zh"] || {
        back: "Back to Jobs",
        apply: "Apply Now",
        posted: "Posted on",
        salary: "Salary",
        type: "Job Type",
        location: "Location",
        description: "Job Description",
        requirements: "Requirements",
        share: "Share this Job",
        visa: "Visa Sponsorship Available",
    };

    // Construct absolute URL for QR code (assuming localhost for dev, env var for prod)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const currentUrl = `${baseUrl}/${lang}/jobs/${id}`;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
                href={`/${lang}/jobs`}
                className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back}
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Job Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Header Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                                    {job.title}
                                </h1>
                                <div className="mt-2 flex items-center gap-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                                    <Building2 className="h-5 w-5" />
                                    {job.company?.name}
                                </div>
                            </div>
                            {job.company?.logo_url && (
                                <img
                                    src={job.company.logo_url}
                                    alt={job.company.name}
                                    className="h-16 w-16 rounded-lg object-contain bg-gray-50"
                                />
                            )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {job.type}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Banknote className="h-4 w-4" />
                                {job.salary_range || "Competitive"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {new Date(job.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {job.is_visa_sponsored && (
                            <div className="mt-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400">
                                ✅ {t.visa}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {t.description}
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert whitespace-pre-line">
                            {job.description}
                        </div>

                        {job.requirements && (
                            <>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">
                                    {t.requirements}
                                </h2>
                                <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 dark:prose-invert whitespace-pre-line">
                                    {job.requirements}
                                </div>
                            </>
                        )}
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6">

                    {/* Apply Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <a
                            href={job.application_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {t.apply}
                        </a>
                        <div className="mt-4">
                            <WeChatShare url={currentUrl} lang={lang} />
                        </div>
                    </div>

                    {/* Match Score Card */}
                    <MatchScore
                        jobTitle={job.title}
                        jobDescription={job.description + " " + (job.requirements || "")}
                        resumeInsight={resumeInsight}
                        lang={lang}
                        isLoggedIn={!!user}
                    />

                </div>
            </div>
        </div>
    );
}
