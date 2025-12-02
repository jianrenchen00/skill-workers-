"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumeUploader({ lang, userId }: { lang: string; userId: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadFile(e.target.files[0]);
        }
    };

    const uploadFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError(lang === "en" ? "Please upload a PDF file." : "请上传 PDF 格式的文件。");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError(lang === "en" ? "File size must be less than 5MB." : "文件大小不能超过 5MB。");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const fileName = `${userId}/${Date.now()}_${file.name}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from("resumes")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Create DB Record
            const { data: insightData, error: dbError } = await supabase
                .from("resume_insights")
                .insert({
                    user_id: userId,
                    file_path: fileName,
                    status: "analyzing",
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // 3. Refresh page to show "Analyzing" state immediately
            router.refresh();

            // 4. Trigger Analysis (Async)
            fetch("/api/analyze-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ insight_id: insightData.id }),
            }).then(async (res) => {
                if (res.ok) {
                    router.refresh();
                } else {
                    console.error("Analysis trigger failed");
                }
            });

        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const t = {
        en: {
            dragDrop: "Drag and drop your resume here",
            or: "or",
            browse: "Browse Files",
            support: "Supports PDF up to 5MB",
            uploading: "Uploading...",
        },
        zh: {
            dragDrop: "将简历拖放到此处",
            or: "或",
            browse: "浏览文件",
            support: "支持 PDF 格式，最大 5MB",
            uploading: "上传中...",
        },
    }[lang as "en" | "zh"] || {
        dragDrop: "Drag and drop your resume here",
        or: "or",
        browse: "Browse Files",
        support: "Supports PDF up to 5MB",
        uploading: "Uploading...",
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors
          ${isDragging
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/50"
                    }
        `}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                            {t.uploading}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="rounded-full bg-indigo-50 p-3 dark:bg-indigo-900/30">
                            <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                            {t.dragDrop}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {t.or}
                        </p>
                        <label className="mt-4 cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                            {t.browse}
                            <input
                                type="file"
                                className="hidden"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                            />
                        </label>
                        <p className="mt-4 text-xs text-gray-400">
                            {t.support}
                        </p>
                    </>
                )}
            </div>

            {error && (
                <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
