import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";

import { useLanguage } from "@/context/LanguageContext";

const PageTitle = ({ title, description, breadcrumb }) => {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const { pathname } = useLocation();

    const isHome = pathname === "/";

    return (
        <>
            {!isHome && (
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-ink/50"
                >
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-1 transition-colors hover:text-primary"
                    >
                        {isArabic ? "الرئيسية" : "Home"}
                        <ChevronRight
                            className="size-2.5 rtl:rotate-180 group-hover:translate-x-0.5"
                        />
                    </Link>
                    {breadcrumb && (
                        <>
                            <ChevronRight className="size-2.5 rtl:rotate-180" />
                            <span className="truncate text-ink">{breadcrumb}</span>
                        </>
                    )}
                </nav>
            )}

            <div className="flex flex-col gap-2">
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-ink/60 leading-6">
                        {description}
                    </p>
                )}
            </div>
        </>
    );
};

export default PageTitle;
