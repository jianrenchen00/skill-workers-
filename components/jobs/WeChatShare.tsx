"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Share2, X } from "lucide-react";

export default function WeChatShare({ url, lang }: { url: string; lang: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const t = {
        en: {
            share: "Share to WeChat",
            scan: "Scan via WeChat to Share",
            close: "Close"
        },
        zh: {
            share: "分享到微信",
            scan: "微信扫一扫分享给好友",
            close: "关闭"
        }
    }[lang as "en" | "zh"] || {
        share: "Share to WeChat",
        scan: "Scan via WeChat to Share",
        close: "Close"
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                <Share2 className="h-4 w-4 text-green-600" />
                {t.share}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t.scan}
                            </h3>
                            <div className="my-6 rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                                <QRCodeSVG value={url} size={200} level="H" includeMargin={true} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'zh' ? '打开微信 -> 发现 -> 扫一扫' : 'Open WeChat -> Discover -> Scan'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
