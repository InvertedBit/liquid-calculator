import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "../providers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "../globals.css";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LiquidCalc",
    description: "E-Liquid calculator and management app",
};


export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise <{locale: string}>;
}) {
    const locale = (await params).locale;


    if (!routing.locales.includes(locale as 'en' || 'de')) {
        notFound();
    }

    const messages = await getMessages();


    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    let profileDiv = (<div></div>)
    if (error || !data?.user) {
        profileDiv = (
        <div>
            <Link prefetch={false} href="/login">Log in or sign up</Link>
        </div>
        );
    } else {
        profileDiv = (<div>
        <span>Logged in as</span> <Link prefetch={false} href="/profile" className="text-primary-800">{data.user.email}</Link><br />
        <Link prefetch={false} href="/logout" className="text-red-600">Sign out</Link>
        </div>);
    }

    const tN = await getTranslations({locale});

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <div className="min-h-screen">
                            <div className="container mx-auto py-12">
                                <div className="flex flex-row">
                                    <div>
                                        <Link prefetch={false} href="/" className="text-3xl">LiquidCalc</Link>
                                    </div>
                                    <div className="basis-full grid grid-flow-col gap-5 mx-10">
                                        <Link prefetch={false} href="/calculator" className="text-xl">{tN('Navigation.calculator')}</Link>
                                        <Link prefetch={false} href="/liquids" className="text-xl">{tN('Navigation.liquids')}</Link>
                                        <Link prefetch={false} href="/bases" className="text-xl">{tN('Navigation.bases')}</Link>
                                        <Link prefetch={false} href="/flavours" className="text-xl">{tN('Navigation.flavours')}</Link>

                                    </div>
                                    <div>
                                        {profileDiv}
                                    </div>
                                </div>
                            </div>
                            {children}

                        </div>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
};