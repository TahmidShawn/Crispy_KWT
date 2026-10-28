import { Flame, Tag, Plus } from "lucide-react";
import { Link } from "react-router";

import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import useAddToCart from "@/hooks/useAddToCart";

const HotDeals = () => {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";

    const { addToCart } = useAddToCart();

    const {
        data: cakesResponse,
        isLoading,
        error,
    } = useGet({
        url: "/cakes?sort=discount&limit=8",
        queryKey: ["hot-deals"],
    });

    const cakes = (cakesResponse?.data ?? [])
        .filter(
            (cake) =>
                Number(cake.discountPercentage) > 0 &&
                Number(cake.stock) > 0,
        )
        .sort(
            (a, b) =>
                Number(b.discountPercentage) -
                Number(a.discountPercentage),
        )
        .slice(0, 8);

    const getName = (cake) =>
        cake.name?.[language] || cake.name?.en || "";

    const getCategoryName = (cake) => {
        const category = cake.category;
        return category?.name?.[language] || category?.name?.en || "";
    };

    const formatPrice = (price) =>
        `${Number(price).toFixed(3)} KWD`;

    const handleAddToCart = (event, cake) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(cake);
    };

    if (isLoading) {
        return (
            <section className="border-t border-ink/10 bg-cream py-16 md:py-20">
                <div className="wrapper">
                    <div className="mb-10 space-y-3 md:mb-12">
                        <div className="h-3 w-28 animate-pulse bg-ink/10" />
                        <div className="h-10 w-56 animate-pulse bg-ink/10" />
                        <div className="h-4 w-72 max-w-full animate-pulse bg-ink/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[290px] animate-pulse rounded-[14px] bg-ink/10 md:h-[340px]"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || !cakes.length) {
        return null;
    }

    return (
        <section className="py-2">
            <div className="wrapper">
                {/* Section heading */}
                <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-ink" />

                            <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink">
                                {t?.hotDeals?.eyebrow ||
                                    (isArabic
                                        ? "عروض لفترة محدودة"
                                        : "Special prices, sweeter moments")}
                            </span>
                        </div>

                        <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-primary md:text-5xl">
                            {t?.hotDeals?.heading ||
                                (isArabic ? "أفضل العروض" : "Hot Deals")}
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                            {t?.hotDeals?.subheading ||
                                (isArabic
                                    ? "اكتشف كعكاتك المفضلة بأسعار لا تقاوم"
                                    : "Your favorite cakes, now at irresistible prices.")}
                        </p>
                    </div>

                    {/* Deal count and shop link */}
                    <div className="flex items-center justify-between gap-4 self-stretch md:self-auto">
                        <div className="flex items-center gap-3">
                            <span className="font-display text-5xl font-semibold leading-none text-primary md:text-6xl">
                                {String(cakes.length).padStart(2, "0")}
                            </span>

                            <div className="flex flex-col gap-0.5 border-s border-ink/15 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em]">
                                <span className="text-ink">
                                    {isArabic ? "عروض" : "Hot deals"}
                                </span>

                                <span className="text-ink/45">
                                    {isArabic
                                        ? "متاحة الآن"
                                        : "available now"}
                                </span>
                            </div>
                        </div>

                       
                    </div>
                </div>

                {/* Hot deals grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-4">
                    {cakes.map((cake) => {
                        const image = cake.images?.[0]?.url;
                        const originalPrice = Number(cake.price);

                        const discountedPrice = Number(
                            cake.discountedPrice ??
                                originalPrice *
                                    (1 -
                                        Number(cake.discountPercentage) /
                                            100),
                        );

                        return (
                            <article
                                key={cake._id}
                                className="group relative block h-[290px] overflow-hidden rounded-[14px] bg-ink text-cream md:h-[340px]"
                            >
                                {/* Product image */}
                                <Link
                                    to={`/cake/${cake.slug}`}
                                    aria-label={getName(cake)}
                                    className="absolute inset-0 overflow-hidden bg-blush"
                                >
                                    {image ? (
                                        <img
                                            src={image}
                                            alt={getName(cake)}
                                            loading="lazy"
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <Tag className="size-10 text-primary/40" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,32,38,0.02)_25%,rgba(59,32,38,0.88)_100%)]" />
                                </Link>

                                {/* Discount badge */}
                                <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex items-center gap-1.5 bg-cream px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary md:start-4 md:top-4">
                                    <Flame className="size-3.5" />

                                    {Number(cake.discountPercentage)}%{" "}
                                    {isArabic ? "خصم" : "OFF"}
                                </span>

                                {/* Bottom product information */}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-4 md:p-[23px]">
                                    <div className="min-w-0">
                                        <Link
                                            to={`/cake/${cake.slug}`}
                                            className="pointer-events-auto block"
                                        >
                                            <h3 className="mb-3 truncate font-display text-xl font-semibold text-cream transition-opacity group-hover:opacity-85 md:text-2xl">
                                                {getName(cake)}
                                            </h3>
                                        </Link>

                                        <div className="mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                            <span className="text-sm font-bold text-cream md:text-base">
                                                {formatPrice(discountedPrice)}
                                            </span>

                                            <span className="text-xs text-cream/65 line-through">
                                                {formatPrice(originalPrice)}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/cake/${cake.slug}`}
                                            className="pointer-events-auto inline-flex items-center border border-cream/40 bg-cream px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary transition-colors duration-200 hover:bg-transparent hover:text-cream"
                                        >
                                            {getCategoryName(cake)}
                                        </Link>
                                    </div>

                                    {/* Add to cart button */}
                                    <button
                                        type="button"
                                        aria-label={
                                            isArabic
                                                ? `أضف ${getName(cake)} إلى السلة`
                                                : `Add ${getName(cake)} to cart`
                                        }
                                        title={
                                            isArabic
                                                ? "أضف إلى السلة"
                                                : "Add to cart"
                                        }
                                        onClick={(event) =>
                                            handleAddToCart(event, cake)
                                        }
                                        className="pointer-events-auto grid size-9 shrink-0 place-items-center border border-white/45 bg-white/5 text-white transition-colors duration-200 hover:bg-cream hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
                                    >
                                        <Plus className="size-5" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HotDeals;