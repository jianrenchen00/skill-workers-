import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ResumeUploader from "@/components/dashboard/ResumeUploader";
import AutoRefresh from "@/components/dashboard/AutoRefresh";
import { Loader2, CheckCircle, AlertTriangle, Briefcase, Lightbulb, XCircle } from "lucide-react";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${lang}/login`);
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch latest resume insight
    const { data: insight } = await supabase
        .from("resume_insights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    const t = {
        en: {
            welcome: "Welcome back",
            role: "Your role",
            logout: "Sign out",
            uploadTitle: "Upload Your Resume",
            uploadSubtitle: "Get AI-powered insights to improve your job application.",
            analyzingTitle: "AI is analyzing your resume...",
            analyzingSubtitle: "This usually takes about 10-20 seconds. Please wait.",
            resultsTitle: "Resume Analysis Results",
            strengths: "Strengths",
            weaknesses: "Areas for Improvement",
            roles: "Recommended Roles",
            tips: "Interview Tips",
            gaps: "Skill Gaps",
            reupload: "Analyze Another Resume",
        },
        zh: {
            welcome: "欢迎回来",
            role: "您的角色",
            logout: "退出登录",
            uploadTitle: "上传您的简历",
            uploadSubtitle: "获取 AI 驱动的分析建议，提升求职成功率。",
            analyzingTitle: "AI 正在分析您的简历...",
            analyzingSubtitle: "通常需要 10-20 秒，请稍候。",
            resultsTitle: "简历分析报告",
            strengths: "核心优势",
            weaknesses: "改进建议",
            roles: "推荐岗位",
            tips: "面试技巧",
            gaps: "技能缺口",
            reupload: "分析另一份简历",
        },
    }[lang as "en" | "zh"] || {
        welcome: "Welcome back",
        role: "Your role",
        logout: "Sign out",
        uploadTitle: "Upload Your Resume",
        uploadSubtitle: "Get AI-powered insights to improve your job application.",
        analyzingTitle: "AI is analyzing your resume...",
        analyzingSubtitle: "This usually takes about 10-20 seconds. Please wait.",
        resultsTitle: "Resume Analysis Results",
        strengths: "Strengths",
        weaknesses: "Areas for Improvement",
        roles: "Recommended Roles",
        tips: "Interview Tips",
        gaps: "Skill Gaps",
        reupload: "Analyze Another Resume",
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.welcome}, {profile?.full_name || user.email}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t.role}: <span className="font-medium text-indigo-600 dark:text-indigo-400">{profile?.role || "User"}</span>
                    </p>
                </div>
                <form action="/auth/signout" method="post">
                    <button className="text-sm font-medium text-red-600 hover:text-red-500">
                        {t.logout}
                    </button>
                </form>
            </div>

            {/* Main Content Area */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                {/* State A: No Resume */}
                {!insight && (
                    <div className="py-12 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.uploadTitle}</h2>
                        <p className="mb-8 mt-2 text-gray-500 dark:text-gray-400">{t.uploadSubtitle}</p>
                        <ResumeUploader lang={lang} userId={user.id} />
                    </div>
                )}

                {/* State B: Analyzing */}
                {insight && insight.status === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <AutoRefresh intervalMs={3000} />
                        <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
                        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{t.analyzingTitle}</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">{t.analyzingSubtitle}</p>
                    </div>
                )}

                {/* State C: Results */}
                {insight && insight.status === 'completed' && insight.analysis_data && (
                    <div>
                        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.resultsTitle}</h2>
                            <span className="text-sm text-gray-500">
                                {new Date(insight.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Strengths */}
                            <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                                <div className="mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    <h3 className="font-semibold">{t.strengths}</h3>
                                </div>
                                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    {(insight.analysis_data as any).strengths?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    )) || <li>No data available</li>}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="rounded-lg bg-amber-50 p-6 dark:bg-amber-900/20">
                                <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <AlertTriangle className="h-5 w-5" />
                                    <h3 className="font-semibold">{t.weaknesses}</h3>
                                </div>
                                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    {(insight.analysis_data as any).weaknesses?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    )) || <li>No data available</li>}
                                </ul>
                            </div>

                            {/* Skill Gaps */}
                            <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
                                <div className="mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <XCircle className="h-5 w-5" />
                                    <h3 className="font-semibold">{t.gaps}</h3>
                                </div>
                                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    {(insight.analysis_data as any).skill_gaps?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    )) || <li>No data available</li>}
                                </ul>
                            </div>

                            {/* Recommended Roles */}
                            <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                                <div className="mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <Briefcase className="h-5 w-5" />
                                    <h3 className="font-semibold">{t.roles}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(insight.analysis_data as any).recommended_roles?.map((role: string, i: number) => (
                                        <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm dark:bg-blue-950 dark:text-blue-300">
                                            {role}
                                        </span>
                                    )) || <span>No data available</span>}
                                </div>
                            </div>

                            {/* Interview Tips */}
                            <div className="col-span-full rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
                                <div className="mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                    <Lightbulb className="h-5 w-5" />
                                    <h3 className="font-semibold">{t.tips}</h3>
                                </div>
                                <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                    {(insight.analysis_data as any).interview_tips?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    )) || <li>No data available</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Upgrade Section (Monetization) */}
                        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-8 text-center dark:border-indigo-900/30 dark:bg-indigo-900/10">
                                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                                    {lang === 'zh' ? '解锁无限次分析' : 'Unlock Unlimited Analysis'}
                                </h3>
                                <p className="mt-2 text-indigo-700 dark:text-indigo-300">
                                    {lang === 'zh'
                                        ? '您已使用完免费试用额度。升级到 Pro 版以分析更多简历并获取定制化职位推荐。'
                                        : 'You have used your free trial. Upgrade to Pro to analyze more resumes and get tailored job matches.'}
                                </p>
                                <button disabled className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white opacity-75 cursor-not-allowed shadow-sm hover:bg-indigo-500">
                                    {lang === 'zh' ? '升级到 Pro (即将推出)' : 'Upgrade to Pro (Coming Soon)'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
