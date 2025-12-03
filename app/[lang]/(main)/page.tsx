import { Upload } from "lucide-react";
import Image from "next/image";
import SearchSection from "@/components/home/SearchSection";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const t = {
    en: {
      heroTitle: "Find Your Dream Job in the UK",
      heroSubtitle: "Connecting Chinese talent with top UK employers and visa sponsors.",
      searchPlaceholder: "Job title, keywords, or company",
      locationPlaceholder: "City or postcode",
      searchButton: "Search Jobs",
      uploadResume: "Upload Resume",
      popularSearches: "Popular: Software Engineer, Marketing, Visa Sponsorship",
    },
    zh: {
      heroTitle: "在英国找到你的理想工作",
      heroSubtitle: "连接华人人才与英国顶尖雇主及签证赞助商。",
      searchPlaceholder: "职位名称、关键词或公司",
      locationPlaceholder: "城市或邮编",
      searchButton: "搜索职位",
      uploadResume: "上传简历",
      popularSearches: "热门搜索：软件工程师，市场营销，工签赞助",
    },
  }[lang as "en" | "zh"] || { // Fallback
    heroTitle: "Find Your Dream Job in the UK",
    heroSubtitle: "Connecting Chinese talent with top UK employers and visa sponsors.",
    searchPlaceholder: "Job title, keywords, or company",
    locationPlaceholder: "City or postcode",
    searchButton: "Search Jobs",
    uploadResume: "Upload Resume",
    popularSearches: "Popular: Software Engineer, Marketing, Visa Sponsorship",
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#1e3a8a] py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              {t.heroSubtitle}
            </p>

            {/* Search Box */}
            <SearchSection lang={lang} t={t} />


            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={`/${lang}/dashboard`}
                className="flex items-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1e3a8a] shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Upload className="h-4 w-4" />
                {t.uploadResume}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for Stats or Trust Indicators */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                {lang === "en" ? "Find Visa Sponsorship Jobs in Western Europe" : "在西欧寻找提供签证赞助的工作"}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {lang === "en"
                  ? "The leading job platform for skilled workers in the UK, Ireland, France, Germany, and Netherlands."
                  : "连接英国、爱尔兰、法国、德国和荷兰的顶尖人才与雇主。"}
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Active Jobs</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">2,000+</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Visa Sponsors</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">85,000+</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Resumes Uploaded</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">15k+</dd>
              </div>
              <div className="flex flex-col bg-gray-400/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Success Rate</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">98%</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
