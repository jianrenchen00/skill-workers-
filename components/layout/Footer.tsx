import Link from "next/link";

export default function Footer({ lang }: { lang: string }) {
    const t = {
        en: {
            copyright: "© 2025 UK Chinese Jobs. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            about: "About Us",
            contact: "Contact",
        },
        zh: {
            copyright: "© 2025 英国华人招聘. 版权所有.",
            privacy: "隐私政策",
            terms: "服务条款",
            about: "关于我们",
            contact: "联系我们",
        },
    }[lang as "en" | "zh"] || {
        copyright: "© 2025 UK Chinese Jobs. All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        about: "About Us",
        contact: "Contact",
    };

    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href={`/${lang}/about`} className="text-gray-400 hover:text-gray-300">
                        {t.about}
                    </Link>
                    <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-gray-300">
                        {t.privacy}
                    </Link>
                    <Link href={`/${lang}/terms`} className="text-gray-400 hover:text-gray-300">
                        {t.terms}
                    </Link>
                    <Link href={`/${lang}/contact`} className="text-gray-400 hover:text-gray-300">
                        {t.contact}
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-400">
                        {t.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
}
