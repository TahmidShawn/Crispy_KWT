import {
    ArrowUpRight,
    Cake,
    ChevronLeft,
    ChevronRight,
    Filter,
    Flame,
    Loader2,
    Plus,
    X,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import useAddToCart from "@/hooks/useAddToCart";

import ProductFilters from "./ProductFilters";
import { priceRanges, sizes } from "./filterOptions";
import HotDeals from "@/pages/home/hotDeals/HotDeals";

const initialFilters = {
    price: null,
    size: [],
};

const heroButton =
    "inline-flex h-9 cursor-pointer items-center justify-center gap-2 border border-cream/40 bg-cream/5 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-cream hover:text-primary";

const outlineButton =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-ink/25 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-cream";

const pageButton = (isActive) =>
    `grid size-10 cursor-pointer place-items-center border text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40 ${
        isActive
            ? "border-primary bg-primary text-cream"
            : "border-ink/20 text-ink hover:border-primary hover:text-primary"
    }`;

const formatPrice = (price) => `${Number(price).toFixed(3)} KWD`;

// 1 … 4 5 6 … 12 শৈলীর পেজ নম্বর
const getPageNumbers = (current, total) => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("start-ellipsis");

    for (let value = start; value <= end; value += 1) {
        pages.push(value);
    }

    if (end < total - 1) pages.push("end-ellipsis");

    pages.push(total);

    return pages;
};

const Products = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const { language } = useLanguage();

    const [filters, setFilters] = useState(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sort, setSort] = useState("featured");
    const [page, setPage] = useState(1);

    const isArabic = language === "ar";

    const search =
        searchParams.get("query")?.trim() ||
        searchParams.get("search")?.trim() ||
        "";

    // Category পেজে "featured" মানে অ্যাডমিনের সাজানো ক্রম (display-order)
    const sortParam =
        sort !== "featured" ? sort : slug ? "display-order" : null;

    const params = {
        ...(slug && { category: slug }),
        ...(search && { search }),
        ...(filters.price && {
            price: filters.price,
        }),
        ...(filters.size.length > 0 && {
            size: filters.size.join(","),
        }),
        ...(sortParam && {
            sort: sortParam,
        }),
        page,
        // feature কার্ড ২ ঘর নেয়, তাই 14টা = ঠিক 5 সারি (3 কলামে)
        limit: 14,
    };

    const {
        data: cakesResponse,
        isLoading,
        isError,
    } = useGet({
        url: "/cakes",
        params,
        queryKey: ["cakes", params],
    });

    const cakes = cakesResponse?.data || [];
    const pagination = cakesResponse?.pagination;
    const totalCakes = pagination?.total ?? cakes.length;

    // Categories (ProductFilters-এর সাথে একই queryKey, তাই cache শেয়ার হয়)
    const { data: categoriesResponse } = useGet({
        url: "/categories",
        params: {
            isActive: true,
        },
        queryKey: ["categories", "active"],
    });

    const categories = categoriesResponse?.data || [];
    const activeCategory = categories.find(
        (category) => category.slug === slug,
    );

    // Dynamic category name (works whether `category` is an object or an array)
    const firstCategory = cakes[0]?.category;

    const categoryName =
        activeCategory?.name?.[language] ||
        (Array.isArray(firstCategory)
            ? firstCategory[0]?.name?.[language]
            : firstCategory?.name?.[language]) ||
        slug?.replace(/-/g, " ") ||
        (isArabic ? "فئة المنتجات" : "Category");

    const {
        addToCart,
        isPending: isAddingToCart,
        pendingCakeId,
    } = useAddToCart();

    const handleAddToCart = (event, cake) => {
        event.preventDefault();
        event.stopPropagation();

        addToCart(cake._id);
    };

    const handleFilterChange = (nextFilters) => {
        setFilters(nextFilters);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    // Reset page to 1 when filters, search, or sort change
    useEffect(() => {
        setPage(1);
    }, [filters.price, filters.size, sort, search, slug]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const selectedFilters = [];

    if (filters.price) {
        const range = priceRanges.find((item) => item.value === filters.price);

        if (range) {
            selectedFilters.push({
                type: "price",
                value: range.value,
                label: range.label[language],
            });
        }
    }

    filters.size.forEach((size) => {
        const option = sizes.find((item) => item.value === size);

        selectedFilters.push({
            type: "size",
            value: size,
            label: option?.label[language] || size,
        });
    });

    const removeFilter = (type, value) => {
        if (type === "price") {
            setFilters((current) => ({
                ...current,
                price: null,
            }));

            return;
        }

        if (type === "size") {
            setFilters((current) => ({
                ...current,
                size: current.size.filter((item) => item !== value),
            }));
        }
    };

    const pageTitle = slug
        ? categoryName
        : search
          ? isArabic
              ? `نتائج البحث عن “${search}”`
              : `Search results for “${search}”`
          : isArabic
            ? "استكشف كعكاتنا"
            : "Explore our cakes";

    const breadcrumbLabel = slug
        ? categoryName
        : search
          ? isArabic
              ? "نتائج البحث"
              : "Search"
          : isArabic
            ? "الكعكات"
            : "Cakes";

    return (
        <>
            <main className="bg-cream pb-16 md:pb-0">
                {/* Hero */}
                <section className="relative isolate overflow-hidden bg-ink text-cream">
                    {/* Category image background */}
                    {activeCategory?.imageUrl && (
                        <img
                            src={activeCategory.imageUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 -z-20 size-full scale-105 object-cover"
                        />
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(59,32,38,0.62)_0%,rgba(59,32,38,0.93)_100%)]" />
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.09),transparent_45%)]" />

                    <div className="wrapper py-7 md:py-10">
                        {/* Breadcrumb */}
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-cream/60"
                        >
                            <Link
                                to="/"
                                className="transition-colors hover:text-cream"
                            >
                                {isArabic ? "الرئيسية" : "Home"}
                            </Link>

                            <ChevronRight className="size-3 rtl:rotate-180" />

                            <span className="truncate text-cream">
                                {breadcrumbLabel}
                            </span>
                        </nav>

                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-2xl">
                                {/* Title */}
                                <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.045em] text-cream md:text-4xl">
                                    {pageTitle}
                                </h1>

                                {/* Subtitle */}
                                <p className="mt-2.5 max-w-md text-xs leading-relaxed text-cream/75 md:text-sm">
                                    {isArabic
                                        ? "اختر من مجموعتنا من الكعكات المصنوعة لكل مناسبة."
                                        : "Browse our collection of cakes crafted for every occasion."}
                                </p>
                            </div>

                            {/* Count + mobile filter button */}
                            <div className="flex items-center justify-between gap-4 self-stretch md:self-auto">
                                <div className="flex items-center gap-3">
                                    <span className="font-display text-4xl font-semibold leading-none text-cream md:text-5xl">
                                        {isLoading
                                            ? "--"
                                            : String(totalCakes).padStart(
                                                  2,
                                                  "0",
                                              )}
                                    </span>

                                    <div className="flex flex-col gap-0.5 border-s border-cream/25 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em]">
                                        <span className="text-cream">
                                            {isArabic ? "كعكات" : "Cakes"}
                                        </span>

                                        <span className="text-cream/50">
                                            {isArabic ? "متاحة" : "available"}
                                        </span>
                                    </div>
                                </div>

                                <Sheet
                                    open={mobileFiltersOpen}
                                    onOpenChange={setMobileFiltersOpen}
                                >
                                    <SheetTrigger asChild>
                                        <button
                                            type="button"
                                            className={`${heroButton} md:hidden`}
                                        >
                                            <Filter className="size-4" />
                                            {isArabic ? "تصفية" : "Filters"}
                                            {selectedFilters.length > 0 &&
                                                ` (${selectedFilters.length})`}
                                        </button>
                                    </SheetTrigger>

                                    <SheetContent
                                        side={isArabic ? "left" : "right"}
                                        className="w-[min(90vw,380px)] overflow-y-auto bg-cream p-0"
                                    >
                                        <SheetHeader className="border-b border-ink/10 px-5 py-5 text-start">
                                            <SheetTitle className="font-display text-xl font-semibold text-primary">
                                                {isArabic
                                                    ? "تصفية المنتجات"
                                                    : "Filter products"}
                                            </SheetTitle>

                                            <SheetDescription className="text-ink/60">
                                                {isArabic
                                                    ? "اختر ما يناسبك"
                                                    : "Refine your selection"}
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className="px-5 py-5">
                                            <ProductFilters
                                                filters={filters}
                                                onFilterChange={
                                                    handleFilterChange
                                                }
                                                onNavigate={() =>
                                                    setMobileFiltersOpen(false)
                                                }
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Listing */}
                <section className="relative overflow-hidden py-10 md:py-14">
                    {/* Soft decorative glows */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-e-32 top-24 size-105 rounded-full bg-blush/50 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-s-32 bottom-24 size-90 rounded-full bg-blush/40 blur-3xl"
                    />

                    <div className="wrapper relative">
                        <div className="flex items-start gap-8">
                            <aside className="hidden w-60 shrink-0 md:block lg:w-64 xl:w-72">
                                <div className="sticky top-24 rounded-[14px] border border-ink/10 bg-white/60 p-5 backdrop-blur-sm">
                                    <ProductFilters
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </aside>

                            <div className="min-w-0 flex-1">
                                {/* Toolbar */}
                                <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                                        {isArabic
                                            ? `عرض ${cakes.length} من ${totalCakes}`
                                            : `Showing ${cakes.length} of ${totalCakes}`}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60 md:block">
                                            {isArabic ? "ترتيب حسب" : "Sort by"}
                                        </span>

                                        <Select
                                            value={sort}
                                            onValueChange={setSort}
                                        >
                                            <SelectTrigger className="h-9 w-40 rounded-none border-ink/20 bg-transparent text-xs">
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="featured">
                                                    {isArabic
                                                        ? "مميز"
                                                        : "Featured"}
                                                </SelectItem>

                                                <SelectItem value="price-low">
                                                    {isArabic
                                                        ? "السعر: الأقل"
                                                        : "Price: Low to high"}
                                                </SelectItem>

                                                <SelectItem value="price-high">
                                                    {isArabic
                                                        ? "السعر: الأعلى"
                                                        : "Price: High to low"}
                                                </SelectItem>

                                                <SelectItem value="name">
                                                    {isArabic
                                                        ? "الاسم"
                                                        : "Name"}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Selected filters */}
                                {selectedFilters.length > 0 && (
                                    <div className="mb-6 flex flex-wrap items-center gap-2">
                                        <span className="me-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60">
                                            {isArabic
                                                ? "الفلاتر المحددة:"
                                                : "Selected:"}
                                        </span>

                                        {selectedFilters.map((filter) => (
                                            <button
                                                key={`${filter.type}-${filter.value}`}
                                                type="button"
                                                onClick={() =>
                                                    removeFilter(
                                                        filter.type,
                                                        filter.value,
                                                    )
                                                }
                                                className="group inline-flex cursor-pointer items-center gap-1.5 border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-cream"
                                            >
                                                {filter.label}

                                                <X className="size-3" />
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="ms-1 cursor-pointer text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
                                        >
                                            {isArabic
                                                ? "مسح الكل"
                                                : "Clear all"}
                                        </button>
                                    </div>
                                )}

                                {/* Loading */}
                                {isLoading && (
                                    <div className="grid grid-cols-2 gap-3 md:gap-4.5 lg:grid-cols-3">
                                        {Array.from({ length: 6 }).map(
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-72.5 animate-pulse rounded-[14px] bg-ink/10 md:h-90 ${
                                                        index === 0
                                                            ? "lg:col-span-2"
                                                            : ""
                                                    }`}
                                                />
                                            ),
                                        )}
                                    </div>
                                )}

                                {/* Error */}
                                {!isLoading && isError && (
                                    <div className="rounded-[14px] border border-ink/10 bg-white/60 px-6 py-16 text-center">
                                        <h2 className="font-display text-2xl font-semibold text-primary">
                                            {isArabic
                                                ? "تعذر تحميل الكعكات"
                                                : "Unable to load cakes"}
                                        </h2>

                                        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                                            {isArabic
                                                ? "حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى."
                                                : "Something went wrong while loading the products. Please try again."}
                                        </p>
                                    </div>
                                )}

                                {/* Grid */}
                                {!isLoading && !isError && cakes.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3 md:gap-4.5 lg:grid-cols-3">
                                        {cakes.map((cake, index) => {
                                            const isFeature =
                                                index === 0 &&
                                                cakes.length >= 3;

                                            const originalPrice = Number(
                                                cake.price,
                                            );

                                            const price = Number(
                                                cake.discountedPrice ??
                                                    cake.price,
                                            );

                                            const hasDiscount =
                                                price < originalPrice;

                                            const discountPercent = Math.round(
                                                ((originalPrice - price) /
                                                    originalPrice) *
                                                    100,
                                            );

                                            const image =
                                                cake.images?.[0]?.url || "";

                                            const name =
                                                cake.name?.[language] ||
                                                cake.name?.en ||
                                                "";

                                            const description =
                                                cake.description?.[language] ||
                                                cake.description?.en ||
                                                "";

                                            const sizeOption = sizes.find(
                                                (item) =>
                                                    item.value ===
                                                    cake.weightSize,
                                            );

                                            const isOutOfStock =
                                                Number(cake.stock) <= 0;

                                            const isThisPending =
                                                isAddingToCart &&
                                                pendingCakeId === cake._id;

                                            return (
                                                <article
                                                    key={cake._id}
                                                    className={`group relative block h-72.5 overflow-hidden rounded-[14px] bg-ink text-cream md:h-90 ${
                                                        isFeature
                                                            ? "lg:col-span-2"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Image */}
                                                    <Link
                                                        to={`/cake/${cake.slug}`}
                                                        aria-label={name}
                                                        className="absolute inset-0 overflow-hidden bg-blush"
                                                    >
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={name}
                                                                loading="lazy"
                                                                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center">
                                                                <Cake className="size-10 text-primary/40" />
                                                            </div>
                                                        )}

                                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,32,38,0.02)_25%,rgba(59,32,38,0.88)_100%)]" />
                                                    </Link>

                                                    {/* Discount badge */}
                                                    {hasDiscount && (
                                                        <span
                                                            dir="ltr"
                                                            className="pointer-events-none absolute inset-s-3 top-3 z-10 inline-flex items-center gap-1.5 bg-cream px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary md:inset-s-4 md:top-4"
                                                        >
                                                            <Flame className="size-3.5" />
                                                            {discountPercent}%{" "}
                                                            {isArabic
                                                                ? "خصم"
                                                                : "OFF"}
                                                        </span>
                                                    )}

                                                    {/* Hover arrow */}
                                                    <span className="pointer-events-none absolute inset-e-3 top-3 z-10 grid size-9 -translate-y-1 place-items-center bg-cream text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:inset-e-4 md:top-4 rtl:-scale-x-100">
                                                        <ArrowUpRight className="size-5" />
                                                    </span>

                                                    {/* Out of stock */}
                                                    {isOutOfStock && (
                                                        <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center bg-ink/45">
                                                            <span className="bg-cream px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                                                                {isArabic
                                                                    ? "نفدت الكمية"
                                                                    : "Out of stock"}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Bottom information */}
                                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-4 md:p-5.75">
                                                        <div className="min-w-0">
                                                            <Link
                                                                to={`/cake/${cake.slug}`}
                                                                className="pointer-events-auto block"
                                                            >
                                                                <h3
                                                                    className={`mb-3 truncate font-display font-semibold text-cream transition-opacity group-hover:opacity-85 ${
                                                                        isFeature
                                                                            ? "text-xl md:text-4xl"
                                                                            : "text-xl md:text-2xl"
                                                                    }`}
                                                                >
                                                                    {name}
                                                                </h3>
                                                            </Link>

                                                            {isFeature &&
                                                                description && (
                                                                    <p className="mb-4 hidden max-w-md text-sm leading-relaxed text-cream/75 line-clamp-2 lg:block">
                                                                        {
                                                                            description
                                                                        }
                                                                    </p>
                                                                )}

                                                            <div className="mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                                                <span
                                                                    className={`font-bold text-cream ${
                                                                        isFeature
                                                                            ? "text-lg md:text-2xl"
                                                                            : "text-lg md:text-xl"
                                                                    }`}
                                                                >
                                                                    {formatPrice(
                                                                        price,
                                                                    )}
                                                                </span>

                                                                {hasDiscount && (
                                                                    <span className="text-xs text-cream/65 line-through">
                                                                        {formatPrice(
                                                                            originalPrice,
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {sizeOption && (
                                                                <p className="w-fit border border-cream/40 bg-cream px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                                                                    {
                                                                        sizeOption
                                                                            .label[
                                                                            language
                                                                        ]
                                                                    }
                                                                    {" · "}
                                                                    {
                                                                        sizeOption
                                                                            .hint[
                                                                            language
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Add to cart */}
                                                        <button
                                                            type="button"
                                                            aria-label={
                                                                isArabic
                                                                    ? `أضف ${name} إلى السلة`
                                                                    : `Add ${name} to cart`
                                                            }
                                                            title={
                                                                isArabic
                                                                    ? "أضف إلى السلة"
                                                                    : "Add to cart"
                                                            }
                                                            disabled={
                                                                isOutOfStock ||
                                                                isThisPending
                                                            }
                                                            onClick={(event) =>
                                                                handleAddToCart(
                                                                    event,
                                                                    cake,
                                                                )
                                                            }
                                                            className="pointer-events-auto grid size-9 shrink-0 cursor-pointer place-items-center border border-white/45 bg-white/5 text-white transition-colors duration-200 hover:bg-cream hover:text-primary group-hover:bg-cream group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            {isThisPending ? (
                                                                <Loader2 className="size-5 animate-spin" />
                                                            ) : (
                                                                <Plus className="size-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Pagination */}
                                {pagination && pagination.pages > 1 && (
                                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            aria-label={
                                                isArabic ? "السابق" : "Previous"
                                            }
                                            className={pageButton(false)}
                                            onClick={() =>
                                                setPage((prev) =>
                                                    Math.max(prev - 1, 1),
                                                )
                                            }
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="size-4 rtl:rotate-180" />
                                        </button>

                                        {getPageNumbers(
                                            page,
                                            pagination.pages,
                                        ).map((item) =>
                                            typeof item === "string" ? (
                                                <span
                                                    key={item}
                                                    className="grid size-10 place-items-center text-ink/40"
                                                >
                                                    …
                                                </span>
                                            ) : (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={pageButton(
                                                        item === page,
                                                    )}
                                                    aria-current={
                                                        item === page
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        setPage(item)
                                                    }
                                                >
                                                    {item}
                                                </button>
                                            ),
                                        )}

                                        <button
                                            type="button"
                                            aria-label={
                                                isArabic ? "التالي" : "Next"
                                            }
                                            className={pageButton(false)}
                                            onClick={() =>
                                                setPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        pagination.pages,
                                                    ),
                                                )
                                            }
                                            disabled={page >= pagination.pages}
                                        >
                                            <ChevronRight className="size-4 rtl:rotate-180" />
                                        </button>
                                    </div>
                                )}

                                {/* Empty */}
                                {!isLoading &&
                                    !isError &&
                                    cakes.length === 0 && (
                                        <div className="rounded-[14px] border border-ink/10 bg-white/60 px-6 py-16 text-center">
                                            <div className="mx-auto mb-5 grid size-14 place-items-center bg-primary text-cream">
                                                <Cake className="size-6" />
                                            </div>

                                            <h2 className="font-display text-2xl font-semibold text-primary">
                                                {isArabic
                                                    ? "لم يتم العثور على كعكات"
                                                    : "No cakes found"}
                                            </h2>

                                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                                                {search
                                                    ? isArabic
                                                        ? `لا توجد نتائج لـ "${search}".`
                                                        : `No results found for “${search}”.`
                                                    : selectedFilters.length > 0
                                                      ? isArabic
                                                          ? "جرّب تغيير الفلاتر أو مسحها."
                                                          : "Try changing or clearing your filters."
                                                      : isArabic
                                                        ? "لا توجد كعكات متاحة في هذه الفئة."
                                                        : "There are no cakes available in this category."}
                                            </p>

                                            {selectedFilters.length > 0 && (
                                                <button
                                                    type="button"
                                                    className={`${outlineButton} mt-6`}
                                                    onClick={clearFilters}
                                                >
                                                    {isArabic
                                                        ? "مسح الفلاتر"
                                                        : "Clear filters"}
                                                </button>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </section>

                <HotDeals
                    eyebrow={isArabic ? "اختياراتنا لك" : "HANDPICKED FOR YOU"}
                    title={isArabic ? "كعكات قد تعجبك" : "You May Also Like"}
                    subtitle={
                        isArabic
                            ? "اكتشف المزيد من الكعكات التي قد تنال إعجابك."
                            : "Discover more cakes you might love."
                    }
                    limit={4}
                />
            </main>
        </>
    );
};

export default Products;
