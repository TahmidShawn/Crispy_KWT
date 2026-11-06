
import { Link } from "react-router";
import {
    Banknote,
    Mail,
    PackageCheck,
    RotateCcw,
    ShoppingBag,
    Truck,
    ArrowUpRight,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL } from "@/config/contact";

const sections = [
    {
        id: "ordering",
        icon: ShoppingBag,
        titleEn: "Ordering & Availability",
        titleAr: "الطلب والتوفر",
        bodyEn: [
            "All cakes are subject to availability. If an item in your order becomes unavailable, we will contact you with a replacement or refund option.",
            "Please double-check your delivery address, phone number and any cake message or special instructions before placing your order.",
            "Custom designs may need extra preparation time. We will confirm the delivery date with you after checkout.",
        ],
        bodyAr: [
            "جميع الكعكات تخضع للتوفر. إذا أصبح أي صنف غير متوفر سنتصل بك لاقتراح بديل أو استرداد المبلغ.",
            "يرجى التأكد من عنوان التوصيل ورقم الهاتف وأي رسالة على الكعكة أو ملاحظات خاصة قبل إتمام الطلب.",
            "قد تحتاج التصاميم المخصصة إلى وقت إضافي للتحضير. سنؤكد معك موعد التوصيل بعد إتمام الشراء.",
        ],
    },
    {
        id: "payment",
        icon: Banknote,
        titleEn: "Payment",
        titleAr: "الدفع",
        bodyEn: [
            "We accept secure online payment and cash on delivery across Kuwait.",
            "Online orders are confirmed only after payment succeeds. If payment fails or expires, the order is cancelled automatically and reserved stock is released.",
            "All prices are displayed in Kuwaiti Dinar (KWD) and include applicable charges shown at checkout.",
        ],
        bodyAr: [
            "نقبل الدفع الإلكتروني الآمن والدفع نقدًا عند الاستلام في جميع أنحاء الكويت.",
            "يتم تأكيد الطلبات الإلكترونية فقط بعد نجاح الدفع. إذا فشل الدفع أو انتهت مهلته يُلغى الطلب تلقائيًا.",
            "جميع الأسعار معروضة بالدينار الكويتي وتشمل الرسوم الموضحة عند إتمام الشراء.",
        ],
    },
    {
        id: "delivery",
        icon: Truck,
        titleEn: "Delivery",
        titleAr: "التوصيل",
        bodyEn: [
            "We deliver across all Kuwait governorates. Delivery fees and available time windows are displayed at checkout.",
            "Please keep your phone reachable on delivery day so our driver can contact you.",
            "Cakes are delicate. Please inspect your order upon arrival and report any damage on the same day so we can assist you.",
        ],
        bodyAr: [
            "نوصل لجميع محافظات الكويت. تظهر رسوم التوصيل والأوقات المتاحة عند إتمام الشراء.",
            "يرجى إبقاء هاتفك متاحًا يوم التوصيل ليتمكن السائق من التواصل معك.",
            "الكعكات حساسة. يرجى فحص طلبك عند الاستلام والإبلاغ عن أي ضرر في نفس اليوم لنتمكن من مساعدتك.",
        ],
    },
    {
        id: "cancellation",
        icon: RotateCcw,
        titleEn: "Cancellations & Refunds",
        titleAr: "الإلغاء والاسترداد",
        bodyEn: [
            "Because our cakes are freshly prepared to order, cancellations are accepted before preparation begins. Please contact us as early as possible.",
            "If we are unable to fulfil your order, you will receive a full refund to your original payment method.",
            "Refund processing times for online payments depend on your bank and typically take 5–14 business days.",
        ],
        bodyAr: [
            "لأن كعكاتنا تُحضّر طازجة عند الطلب، يُقبل الإلغاء قبل بدء التحضير. يرجى التواصل معنا في أقرب وقت ممكن.",
            "إذا تعذر علينا تنفيذ طلبك، ستحصل على استرداد كامل للمبلغ إلى وسيلة الدفع الأصلية.",
            "تعتمد مدة معالجة استرداد المدفوعات الإلكترونية على البنك، وعادةً ما تستغرق من 5 إلى 14 يوم عمل.",
        ],
    },
    {
        id: "quality",
        icon: PackageCheck,
        titleEn: "Product Quality",
        titleAr: "جودة المنتجات",
        bodyEn: [
            "Every cake is prepared with carefully selected ingredients and finished by hand. Product photos are illustrative, and handmade decorations may vary slightly.",
            "Please store cakes according to the provided instructions, usually refrigerated, and enjoy them within the recommended period for the best quality.",
        ],
        bodyAr: [
            "يتم تحضير كل كعكة بمكونات مختارة بعناية وتزيينها يدويًا. الصور توضيحية وقد تختلف الزخارف اليدوية قليلًا.",
            "يرجى حفظ الكعكات وفقًا للتعليمات المقدمة، وعادةً في الثلاجة، والاستمتاع بها خلال المدة الموصى بها للحفاظ على أفضل جودة.",
        ],
    },
];

const TermsConditions = () => {
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
                            {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                            {isArabic
                                ? "يرجى قراءة الشروط التالية بعناية لفهم سياسات الطلب والدفع والتوصيل عند التسوق من كريسبي كيه دبليو تي."
                                : "Please read these terms carefully to understand our ordering, payment and delivery policies when shopping with Crispy KWT."}
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
                            ? "مرحبًا بك في كريسبي كيه دبليو تي. باستخدامك لموقعنا وإتمامك لعملية شراء، فإنك توافق على الالتزام بالشروط والأحكام الموضحة أدناه."
                            : "Welcome to Crispy KWT. By accessing our website and placing an order, you agree to the following terms and conditions. These guidelines help us provide a smooth and reliable shopping experience."}
                    </p>
                </div>

                {/* Terms Sections */}
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
                                    ? "تواصل معنا إذا كنت بحاجة إلى أي توضيح بخصوص هذه الشروط."
                                    : "Get in touch if you need any clarification about these terms."}
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
                        to="/privacy"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
                    >
                        {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
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

export default TermsConditions;
