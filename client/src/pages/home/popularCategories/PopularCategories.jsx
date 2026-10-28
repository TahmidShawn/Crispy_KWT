
import { ArrowRight, Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import { Link } from "react-router";

const POPULAR_CATEGORIES_COUNT = 3;

const PopularCategories = () => {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";

    const {
        data: categoriesResponse,
        isLoading,
        error,
    } = useGet({
        url: "/categories",
        params: {
            isPopular: "true",
            limit: POPULAR_CATEGORIES_COUNT,
        },
        queryKey: [
            "categories",
            "popular",
            {
                isPopular: "true",
                limit: POPULAR_CATEGORIES_COUNT,
            },
        ],
    });

    const categories = (categoriesResponse?.data ?? []).slice(
        0,
        POPULAR_CATEGORIES_COUNT,
    );

    const getName = (cat) => cat.name?.[language] || cat.name?.en || cat.name;

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
                <h3 className="mb-2 font-display text-2xl font-semibold text-ink">
                    {isArabic
                        ? "لا توجد فئات شائعة متاحة"
                        : "No popular categories available"}
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
        <section className="border-t border-ink/10 bg-cream py-16 md:py-20">
            <div className="wrapper">
                {/* Heading */}
                <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-ink" />

                            <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink">
                                {t?.categories?.eyebrow ||
                                    (isArabic
                                        ? "اختر المفضل لديك"
                                        : "Find your favorite")}
                            </span>
                        </div>

                        <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-primary md:text-5xl">
                            {t?.categories?.heading ||
                                (isArabic
                                    ? "الفئات الشائعة"
                                    : "Popular Categories")}
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                            {t?.categories?.subheading ||
                                (isArabic
                                    ? "اكتشف مجموعات الكيك المفضلة لدى عملائنا"
                                    : "Explore our customers' favorite cake collections")}
                        </p>
                    </div>

                    {/* Category count */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <span className="font-display text-5xl font-semibold leading-none text-primary md:text-6xl">
                            {String(categories.length).padStart(2, "0")}
                        </span>

                        <div className="flex flex-col gap-0.5 border-s border-ink/15 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em]">
                            <span className="text-ink">
                                {isArabic ? "فئات" : "Categories"}
                            </span>

                            <span className="text-ink/45">
                                {isArabic ? "للاستكشاف" : "to explore"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Popular category cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-3">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id || cat.id}
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
                                        <span className="font-display text-6xl font-semibold text-primary/40">
                                            {String(getName(cat)).charAt(0)}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,32,38,0.02)_35%,rgba(59,32,38,0.86)_100%)]" />
                            </div>

                            {/* Popular sticker */}
                            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-md md:left-4 md:top-4">
                                <Flame className="size-3.5" />
                                <span>
                                    {isArabic ? "شائع" : "Popular"}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-4 md:p-[23px]">
                                <div className="min-w-0">
                                    <h3 className="truncate font-display text-xl font-semibold text-cream md:text-3xl">
                                        {getName(cat)}
                                    </h3>
                                </div>

                                <span className="grid size-9 shrink-0 place-items-center border border-white/45 bg-white/5 text-white transition-colors duration-200 group-hover:bg-cream group-hover:text-primary rtl:-scale-x-100">
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

export default PopularCategories;
