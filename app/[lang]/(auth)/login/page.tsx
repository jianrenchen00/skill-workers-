import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <LoginForm lang={lang} />;
}
