"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface UpgradeButtonProps {
    userId: string;
    email: string;
    lang: string;
}

export default function UpgradeButton({ userId, email, lang }: UpgradeButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, email }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Checkout Error:", data.error);
                alert("Failed to start checkout. Please try again.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {lang === "zh" ? "升级到 Pro (£9.99)" : "Upgrade to Pro (£9.99)"}
        </button>
    );
}
