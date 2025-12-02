import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia", // Use latest or compatible version
});

export async function POST(request: Request) {
    try {
        const { userId, email } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "gbp",
                        product_data: {
                            name: "Skill Workers Pro",
                            description: "Unlimited Resume Analysis & Premium Features",
                        },
                        unit_amount: 999, // £9.99
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/dashboard?canceled=true`,
            client_reference_id: userId,
            metadata: {
                userId: userId,
            },
            customer_email: email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
