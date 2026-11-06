
import { Link } from "react-router";
import {
    FileText,
    Mail,
    ShieldCheck,
    ArrowUpRight,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL } from "@/config/contact";

const sections = [
    {
        id: "information-we-collect",
        icon: FileText,
        titleEn: "Information We Collect",
        titleAr: "المعلومات التي نجمعها",
        bodyEn: [
            "Account details you provide when registering or checking out, including your name, email address, phone number and delivery address.",
            "Order details, including the cakes and add-ons you purchase, quantities, special instructions and payment method.",
            "Technical information collected automatically, such as device type, browser, pages visited and approximate location, used to maintain website performance and security.",
        ],
        bodyAr: [
            "بيانات الحساب التي تقدمها عند التسجيل أو إتمام الطلب، بما في ذلك الاسم وعنوان البريد الإلكتروني ورقم الهاتف وعنوان التوصيل.",
            "تفاصيل الطلبات، بما في ذلك الكعكات والإضافات التي تشتريها والكميات والملاحظات الخاصة وطريقة الدفع.",
            "المعلومات التقنية التي يتم جمعها تلقائيًا، مثل نوع الجهاز والمتصفح والصفحات التي تزورها والموقع التقريبي، وتُستخدم للحفاظ على أداء الموقع وأمانه.",
        ],
    },
    {
        id: "how-we-use",
        icon: ShieldCheck,
        titleEn: "How We Use Your Information",
        titleAr: "كيف نستخدم معلوماتك",
        bodyEn: [
            "To process, prepare and deliver your orders, and to send order confirmations and delivery updates.",
            "To provide customer support through WhatsApp or email when you contact us.",
            "To improve our cakes, menu and website experience based on aggregated, non-identifying usage trends.",
            "We do not sell your personal information to third parties.",
        ],
        bodyAr: [
            "لمعالجة طلباتك وتجهيزها وتوصيلها، وإرسال تأكيدات الطلب وتحديثات التوصيل.",
            "لتقديم دعم العملاء عبر واتساب أو البريد الإلكتروني عندما تتواصل معنا.",
            "لتحسين الكعكات والقائمة وتجربة الموقع بناءً على اتجاهات استخدام إجمالية غير محددة للهوية.",
            "لا نبيع معلوماتك الشخصية لأي طرف ثالث.",
        ],
    },
];

const Policy = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="wrapper pb-16 pt-8 md:pt-12"
        >
            <div className="mx-auto max-w-4xl">
                {/* Page Header */}
                <header className="relative overflow-hidden rounded-2xl bg-primary/5 px-6 py-10 md:px-10 md:py-14">
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            {isArabic ? "معلومات قانونية" : "Legal Information"}
                        </span>

                        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
                            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                            {isArabic
                                ? "خصوصيتك مهمة بالنسبة لنا. توضح هذه الصفحة كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها عند التسوق من كريسبي كيه دبليو تي."
                                : "Your privacy matters to us. This policy explains how Crispy KWT collects, uses and protects your personal information when you shop with us."}
                        </p>

                        <p className="mt-5 text-xs font-medium text-muted-foreground">
                            {isArabic
                                ? "آخر تحديث: نوفمبر 2026"
                                : "Last updated: November 2026"}
                        </p>
                    </div>

                    <div className="pointer-events-none absolute -bottom-16 -end-12 size-56 rounded-full bg-primary/10 blur-3xl" />
                </header>

                {/* Introduction */}
                <div className="mt-10 max-w-3xl">
                    <p className="text-sm leading-7 text-muted-foreground md:text-base">
                        {isArabic
                            ? "نحن في كريسبي كيه دبليو تي نحترم خصوصيتك ونسعى إلى التعامل مع معلوماتك الشخصية بعناية ومسؤولية. باستخدامك لموقعنا، فإنك توافق على الممارسات الموضحة في سياسة الخصوصية هذه."
                            : "At Crispy KWT, we respect your privacy and are committed to handling your personal information responsibly. By using our website, you acknowledge the practices described in this Privacy Policy."}
                    </p>
                </div>

                {/* Privacy Sections */}
                <div className="mt-10">
                    {sections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <section
                                key={section.id}
                                className="group grid gap-4 border-t border-border/70 py-7 md:grid-cols-[56px_1fr] md:gap-7 md:py-9"
                            >
                                {/* Section Icon */}
                                <div>
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                        <Icon className="size-5" />
                                    </span>
                                </div>

                                {/* Section Content */}
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight text-ink md:text-xl">
                                        {isArabic
                                            ? section.titleAr
                                            : section.titleEn}
                                    </h2>

                                    <ul className="mt-4 space-y-3">
                                        {(isArabic
                                            ? section.bodyAr
                                            : section.bodyEn
                                        ).map((line, lineIndex) => (
                                            <li
                                                key={lineIndex}
                                                className="flex gap-3 text-sm leading-7 text-muted-foreground"
                                            >
                                                <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-primary/70" />
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Contact Section */}
                <section className="mt-6 flex flex-col gap-5 rounded-2xl bg-primary/5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                    <div className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                            <Mail className="size-5" />
                        </span>

                        <div>
                            <h2 className="text-lg font-bold text-ink">
                                {isArabic
                                    ? "هل لديك استفسار؟"
                                    : "Have a question?"}
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {isArabic
                                    ? "لأي سؤال حول بياناتك أو كيفية تعاملنا مع معلوماتك الشخصية، تواصل معنا عبر البريد الإلكتروني."
                                    : "For questions about your personal information or how we handle your data, feel free to contact us."}
                            </p>

                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                            >
                                {CONTACT_EMAIL}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Related Links */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                        to="/terms"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
                    >
                        {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
                        <ArrowUpRight className="size-4" />
                    </Link>

                    <Link
                        to="/order-tracking"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
                    >
                        {isArabic ? "تتبع الطلب" : "Track Your Order"}
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Policy;
