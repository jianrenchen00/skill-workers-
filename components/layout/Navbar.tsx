import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu } from "lucide-react";

export default function Navbar({ lang }: { lang: string }) {
    // Simple translation map for the navbar
    const t = {
        en: {
            brand: "Skill Workers",
            jobs: "Jobs",
            sponsors: "Sponsors",
            dashboard: "Dashboard",
            login: "Login",
        },
        zh: {
            brand: "Skill Workers",
            jobs: "职位",
            sponsors: "签证公司",
            dashboard: "仪表盘",
            login: "登录",
        },
    }[lang as "en" | "zh"] || { // Fallback
        brand: "Skill Workers",
        jobs: "Jobs",
        sponsors: "Sponsors",
        dashboard: "Dashboard",
        login: "Login",
    };

    return (
        <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href={`/${lang}`} className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                {t.brand}
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href={`/${lang}/jobs`}
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white"
                            >
                                {t.jobs}
                            </Link>
                            <Link
                                href={`/${lang}/sponsors`}
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white"
                            >
                                {t.sponsors}
                            </Link>
                            <Link
                                href={`/${lang}/dashboard`}
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white"
                            >
                                {t.dashboard}
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        <LanguageSwitcher lang={lang} />
                        <Link
                            href={`/${lang}/login`}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {t.login}
                        </Link>
                    </div>

                    {/* Mobile menu button placeholder - can be expanded later */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-800 dark:hover:text-white">
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
