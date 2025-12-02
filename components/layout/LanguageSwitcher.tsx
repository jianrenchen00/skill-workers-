"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ lang }: { lang: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const toggleLanguage = () => {
        if (!pathname) return;

        const newLang = lang === "en" ? "zh" : "en";
        const segments = pathname.split("/");

        // segments[0] is empty string because pathname starts with /
        // segments[1] is the locale (en or zh)
        segments[1] = newLang;

        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="Switch Language"
        >
            <Globe className="h-4 w-4" />
            <span>{lang === "en" ? "中文" : "English"}</span>
        </button>
    );
}
