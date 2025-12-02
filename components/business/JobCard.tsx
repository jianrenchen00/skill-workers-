import { MapPin, Building2, Banknote, CheckCircle2, Clock } from "lucide-react";
import { Job } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface JobCardProps {
    job: Job;
    lang: string;
}

export default function JobCard({ job, lang }: JobCardProps) {
    const isEn = lang === "en";
    const title = isEn ? job.title_en : job.title_cn;
    const description = isEn ? job.description_en : job.description_cn;

    // Format date (e.g., "2 days ago") - simplified for now
    const date = new Date(job.created_at).toLocaleDateString(isEn ? 'en-GB' : 'zh-CN');

    return (
        <Link
            href={`/${lang}/jobs/${job.id}`}
            className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
        >
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {job.company?.logo_url ? (
                            <img src={job.company.logo_url} alt={job.company.name} className="h-full w-full rounded-lg object-cover" />
                        ) : (
                            <Building2 className="h-6 w-6" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-gray-200">{job.company?.name}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.country === 'UK' ? '🇬🇧' : '🇪🇺'} {job.location}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Banknote className="h-3.5 w-3.5" />
                                {job.salary_range}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visa Badge */}
                {job.company?.is_verified_sponsor && (
                    <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isEn ? "Visa Sponsor" : "工签资质"}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {description}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {isEn ? `Posted on ${date}` : `发布于 ${date}`}
                </div>
                {job.is_visa_sponsorship_available && (
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {isEn ? "Visa Sponsorship Available" : "提供签证赞助"}
                    </span>
                )}
            </div>
        </Link>
    );
}
