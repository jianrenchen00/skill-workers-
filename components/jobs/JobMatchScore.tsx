"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface MatchScoreProps {
    jobTitle: string;
    jobDescription: string;
    resumeInsight: any; // Using any for flexibility with JSONB
    lang: string;
    isLoggedIn: boolean;
}

export default function MatchScore({ jobTitle, jobDescription, resumeInsight, lang, isLoggedIn }: MatchScoreProps) {
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [reasons, setReasons] = useState<string[]>([]);

    const t = {
        en: {
            title: "AI Match Score",
            calculating: "Analyzing match...",
            login: "Log in to see your match score",
            upload: "Upload resume to see match score",
            high: "Great Match!",
            medium: "Good Potential",
            low: "Gap Identified",
            why: "Why?",
            uploadBtn: "Upload Resume",
            loginBtn: "Log In",
        },
        zh: {
            title: "AI 匹配度分析",
            calculating: "正在分析匹配度...",
            login: "登录后查看匹配度",
            upload: "上传简历以查看匹配度",
            high: "非常匹配！",
            medium: "潜力不錯",
            low: "存在差距",
            why: "匹配原因",
            uploadBtn: "上传简历",
            loginBtn: "去登录",
        }
    }[lang as "en" | "zh"] || {
        title: "AI Match Score",
        calculating: "Analyzing match...",
        login: "Log in to see your match score",
        upload: "Upload resume to see match score",
        high: "Great Match!",
        medium: "Good Potential",
        low: "Gap Identified",
        why: "Why?",
        uploadBtn: "Upload Resume",
        loginBtn: "Log In",
    };

    useEffect(() => {
        if (!isLoggedIn || !resumeInsight) {
            setLoading(false);
            return;
        }

        // Simulate AI analysis delay
        const timer = setTimeout(() => {
            calculateScore();
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [isLoggedIn, resumeInsight]);

    const calculateScore = () => {
        let calculatedScore = 60; // Base score
        const newReasons: string[] = [];
        const analysis = resumeInsight.analysis_data || {};

        // 1. Title Match
        const roles = analysis.recommended_roles || [];
        const titleMatch = roles.some((role: string) =>
            jobTitle.toLowerCase().includes(role.toLowerCase()) ||
            role.toLowerCase().includes(jobTitle.toLowerCase())
        );

        if (titleMatch) {
            calculatedScore += 20;
            newReasons.push(lang === 'zh' ? "您的推荐岗位包含此职位" : "Recommended roles include this job");
        }

        // 2. Keyword Match (Simple)
        const strengths = analysis.strengths || [];
        let strengthMatches = 0;
        strengths.forEach((strength: string) => {
            // Split strength into words and check if they appear in job description
            const keywords = strength.split(' ').filter(w => w.length > 4);
            const hasMatch = keywords.some(k => jobDescription.toLowerCase().includes(k.toLowerCase()));
            if (hasMatch) strengthMatches++;
        });

        if (strengthMatches > 0) {
            const boost = Math.min(strengthMatches * 5, 15);
            calculatedScore += boost;
            newReasons.push(lang === 'zh' ? `您的核心优势中有 ${strengthMatches} 個匹配點` : `Found ${strengthMatches} matching points in your strengths`);
        }

        // Cap at 98 (nobody is perfect :P)
        setScore(Math.min(calculatedScore, 98));
        setReasons(newReasons);
    };

    if (!isLoggedIn) {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <Sparkles className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{t.login}</p>
                <Link href={`/${lang}/login`} className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    {t.loginBtn}
                </Link>
            </div>
        );
    }

    if (!resumeInsight) {
        return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <Sparkles className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{t.upload}</p>
                <Link href={`/${lang}/dashboard`} className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    {t.uploadBtn}
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 text-center dark:border-indigo-900/30 dark:bg-indigo-900/10">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
                <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">{t.calculating}</p>
            </div>
        );
    }

    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-green-600 dark:text-green-400";
        if (s >= 60) return "text-amber-600 dark:text-amber-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreLabel = (s: number) => {
        if (s >= 80) return t.high;
        if (s >= 60) return t.medium;
        return t.low;
    };

    return (
        <div className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/30 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.title}</h3>
            </div>

            <div className="flex items-end gap-2">
                <span className={`text-5xl font-bold ${getScoreColor(score || 0)}`}>
                    {score}
                </span>
                <span className="mb-2 text-sm font-medium text-gray-500">/ 100</span>
            </div>

            <p className={`mt-2 font-medium ${getScoreColor(score || 0)}`}>
                {getScoreLabel(score || 0)}
            </p>

            {reasons.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <p className="mb-2 text-xs font-medium text-gray-500 uppercase">{t.why}</p>
                    <ul className="space-y-2">
                        {reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
