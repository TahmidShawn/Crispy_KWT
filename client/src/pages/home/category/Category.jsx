import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import { Link } from "react-router";

gsap.registerPlugin(ScrollTrigger);

const Category = () => {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";
    const sectionRef = useRef(null);

    const {
        data: categoriesResponse,
        isLoading,
        error,
    } = useGet({
        url: "/categories",
        queryKey: ["categories"],
    });

    const categories = categoriesResponse?.data ?? [];

    const getName = (cat) => cat.name?.[language] || cat.name;

    useLayoutEffect(() => {
        if (isLoading || !categories.length || !sectionRef.current) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const dir = isArabic ? -1 : 1;

        const ctx = gsap.context(() => {
            // ---------- Initial states: বাম পাশ ----------
            gsap.set("[data-anim='line']", {
                scaleX: 0,
                transformOrigin: isArabic ? "right center" : "left center",
            });
            gsap.set("[data-anim='eyebrow']", { autoAlpha: 0, x: -24 * dir });
            gsap.set("[data-anim='title-inner']", { yPercent: 110 });
            gsap.set("[data-anim='subtitle']", { autoAlpha: 0, y: 12 });

            // ---------- Initial states: ডান পাশ ----------
            gsap.set("[data-anim='vline']", {
                scaleY: 0,
                transformOrigin: "top center",
            });
            gsap.set("[data-anim='label']", { autoAlpha: 0, x: -24 * dir });
            gsap.set("[data-anim='sublabel']", { autoAlpha: 0, y: 10 });

            // ---------- Cards ----------
            gsap.set("[data-anim='card']", { autoAlpha: 0, y: 32 });

            // ---------- Counter: শুরুতে 00 ----------
            const counter = { val: 0 };
            const numEl = sectionRef.current.querySelector(
                "[data-anim='number']",
            );
            if (numEl) numEl.textContent = "00";

            // ---------- Heading timeline ----------
            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 78%",
                    toggleActions: "play none none reset",
                },
            })
                // ===== বাম পাশ =====
                .to(
                    "[data-anim='line']",
                    { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
                    0,
                )
                .to(
                    "[data-anim='eyebrow']",
                    { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
                    0.15,
                )
                .to(
                    "[data-anim='title-inner']",
                    { yPercent: 0, duration: 1.2, ease: "expo.out" },
                    0.25,
                )
                .to(
                    "[data-anim='subtitle']",
                    { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" },
                    0.6,
                )
                // ===== ডান পাশ =====
                .to(
                    "[data-anim='vline']",
                    { scaleY: 1, duration: 0.9, ease: "power3.inOut" },
                    0.35,
                )
                .to(
                    "[data-anim='label']",
                    { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
                    0.55,
                )
                .to(
                    "[data-anim='sublabel']",
                    { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" },
                    0.75,
                );

            // ---------- Counter ----------
            let last = -1;

            const counterTween = gsap.to(counter, {
                val: categories.length,
                duration: 2.5,
                ease: "power1.out",
                paused: true,
                snap: { val: 1 }, // শুধু পূর্ণ সংখ্যা
                onUpdate: () => {
                    // সংখ্যা বদলালে তবেই DOM আপডেট
                    if (!numEl || counter.val === last) return;
                    last = counter.val;
                    numEl.textContent = String(counter.val).padStart(2, "0");
                },
            });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 80%",
                onEnter: () => counterTween.restart(),
                onLeaveBack: () => {
                    counterTween.pause(0);
                    counter.val = 0;
                    last = 0;
                    if (numEl) numEl.textContent = "00";
                },
            });

            // ---------- Cards: নরম fade-up ----------
            ScrollTrigger.batch("[data-anim='card']", {
                start: "top 90%",
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        stagger: 0.1,
                        overwrite: true,
                    }),
                onLeaveBack: (batch) =>
                    gsap.set(batch, { autoAlpha: 0, y: 32, overwrite: true }),
            });

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, [isLoading, categories.length, isArabic]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-cream">
                <div className="size-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (error || !categories.length) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-4 text-center">
                <h3 className="mb-2 font-serif text-2xl font-semibold text-ink">
                    {isArabic
                        ? "لا توجد فئات متاحة"
                        : "No categories available"}
                </h3>
                <p className="text-sm text-ink/70">
                    {isArabic
                        ? "يرجى التحقق لاحقاً"
                        : "Please check back later"}
                </p>
            </div>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="border-t border-ink/10 bg-cream py-16 md:py-20"
        >
            <div className="wrapper">
                {/* Heading */}
                <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3">
                            <span
                                data-anim="line"
                                className="h-px w-8 bg-ink"
                            />
                            <span
                                data-anim="eyebrow"
                                className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink"
                            >
                                {t?.categories?.eyebrow ||
                                    (isArabic
                                        ? "اختر المفضل لديك"
                                        : "Find your favorite")}
                            </span>
                        </div>

                        {/* Title (overflow-hidden wrapper = mask) */}
                        <h2 className="mt-3 overflow-hidden pb-1 font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-primary md:text-5xl">
                            <span data-anim="title-inner" className="block">
                                {t?.categories?.heading ||
                                    (isArabic ? "الفئات" : "Categories")}
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p
                            data-anim="subtitle"
                            className="mt-3 max-w-md text-sm leading-relaxed text-ink/70"
                        >
                            {t?.categories?.subheading ||
                                (isArabic
                                    ? "اختر من بين تشكيلة واسعة من الكعكات اللذيذة"
                                    : "Choose from our wide selection of delicious cakes")}
                        </p>
                    </div>

                    {/* Count */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <span
                            data-anim="number"
                            className="font-serif text-5xl font-semibold leading-none tabular-nums text-primary md:text-6xl"
                        >
                            {String(categories.length).padStart(2, "0")}
                        </span>

                        <div className="relative flex flex-col gap-0.5 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em]">
                            {/* border-s এর বদলে এই রেখা, যাতে animate করা যায় */}
                            <span
                                data-anim="vline"
                                className="absolute inset-y-0 start-0 w-px bg-ink/25"
                            />
                            <span data-anim="label" className="text-ink">
                                {isArabic ? "فئات" : "Categories"}
                            </span>
                            <span data-anim="sublabel" className="text-ink/45">
                                {isArabic ? "للاستكشاف" : "to explore"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id || cat.id}
                            data-anim="card"
                            to={`/category/${cat.slug}`}
                            className="group relative block h-[290px] overflow-hidden rounded-[14px] bg-ink text-cream md:h-[340px]"
                        >
                            {/* Image */}
                            <div className="absolute inset-0 overflow-hidden bg-blush">
                                {cat.imageUrl ? (
                                    <img
                                        src={cat.imageUrl}
                                        alt={getName(cat)}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-125"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <span className="font-serif text-6xl font-semibold text-primary/40">
                                            {String(getName(cat)).charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,32,38,0.02)_35%,rgba(59,32,38,0.86)_100%)]" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 z-1 flex items-end justify-between gap-2 p-4 md:p-[23px]">
                                <div className="min-w-0">
                                    <h3 className="mb-5 truncate font-serif text-md font-semibold text-cream md:text-xl">
                                        {getName(cat)}
                                    </h3>
                                    <p className="w-fit bg-cream border border-cream/40 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-primary font-medium">
                                        {cat.cakeCount ?? 0}{" "}
                                        {isArabic ? "كعكة" : "cakes"}
                                    </p>
                                </div>

                                {/* Square button (banner controller style) */}
                                <span className="grid size-9 shrink-0 place-items-center rounded-none border border-white/45 bg-white/5 text-white transition-colors duration-200 group-hover:bg-cream group-hover:text-primary rtl:-scale-x-100">
                                    <ArrowRight className="size-5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;