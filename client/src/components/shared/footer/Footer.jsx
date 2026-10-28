
import { CakeSlice, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";

    const navigationLinks = [
        {
            label: isArabic ? "الرئيسية" : "Home",
            to: "/",
        },
        {
            label: isArabic ? "جميع الكعكات" : "All Cakes",
            to: "/cakes",
        },
        {
            label: isArabic ? "الفئات" : "Categories",
            to: "/categories",
        },
        {
            label: isArabic ? "تواصل معنا" : "Contact Us",
            to: "/contact",
        },
    ];

    const accountLinks = [
        {
            label: isArabic ? "تسجيل الدخول" : "Login",
            to: "/login",
        },
        {
            label: isArabic ? "سلة التسوق" : "Shopping Cart",
            to: "/cart",
        },
        {
            label: isArabic ? "طلباتي" : "My Orders",
            to: "/dashboard/orders",
        },
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer
            dir={isArabic ? "rtl" : "ltr"}
            className="mt-16 bg-primary/7 text-ink"
        >
            <div className="wrapper py-12 md:py-14">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5"
                        >
                            <span className="grid size-10 place-items-center rounded-xl bg-primary text-cream">
                                <CakeSlice className="size-5" />
                            </span>

                            <span className="font-display text-2xl font-bold tracking-tight text-primary">
                                <span className="text-ink">CRISPY</span> KWT
                            </span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-7 text-ink">
                            {isArabic
                                ? "كل كعكة تحمل معها لحظة حلوة. اكتشف نكهاتك المفضلة وشارك السعادة مع من تحب."
                                : "Every cake brings a little happiness. Discover your favorites and make every moment sweeter."}
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-primary">
                            {isArabic ? "استكشف" : "Explore"}
                        </h3>

                        <ul className="space-y-3">
                            {navigationLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors duration-200 hover:text-primary"
                                    >
                                        {item.label}

                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Account */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-primary">
                            {isArabic ? "حسابك" : "Your Account"}
                        </h3>

                        <ul className="space-y-3">
                            {accountLinks.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors duration-200 hover:text-primary"
                                    >
                                        {item.label}

                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 border-t border-ink/10 pt-5">
                    <div className="flex flex-col gap-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {currentYear} Crispy KWT.{" "}
                            {isArabic
                                ? "جميع الحقوق محفوظة."
                                : "All rights reserved."}
                        </p>

                        <p>
                            {isArabic
                                ? "صُنع بحب في الكويت"
                                : "Made with care in Kuwait"}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
