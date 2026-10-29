import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";

import { priceRanges, sizes } from "./filterOptions";

const sectionTitle =
    "text-[10px] font-semibold uppercase tracking-[0.17em] text-ink";

const ProductFilters = ({
    filters = {
        category: null,
        price: null,
        size: [],
    },
    onFilterChange = () => {},
    onNavigate = () => {},
}) => {
    const navigate = useNavigate();
    const { slug: activeSlug } = useParams();
    const { language } = useLanguage();

    const isArabic = language === "ar";

    const { data: categoriesResponse, isLoading: categoriesLoading } = useGet(
        {
            url: "/categories",
            params: {
                isActive: true,
            },
            queryKey: ["categories", "active"],
        },
    );

    const categories = categoriesResponse?.data || [];

    const activeCount = (filters.price ? 1 : 0) + (filters.size?.length ?? 0);

    const goTo = (path) => {
        navigate(path);
        onNavigate();
    };

    const handlePriceChange = (value) => {
        onFilterChange({
            ...filters,
            price: filters.price === value ? null : value,
        });
    };

    const handleSizeChange = (value) => {
        const currentSizes = filters.size || [];

        const nextSizes = currentSizes.includes(value)
            ? currentSizes.filter((item) => item !== value)
            : [...currentSizes, value];

        onFilterChange({
            ...filters,
            size: nextSizes,
        });
    };

    const clearAll = () => {
        onFilterChange({
            category: null,
            price: null,
            size: [],
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative grid size-10 place-items-center bg-primary text-cream">
                        <SlidersHorizontal className="size-4" />

                        {activeCount > 0 && (
                            <span className="absolute -end-1.5 -top-1.5 grid size-4 place-items-center bg-ink text-[9px] font-bold text-cream">
                                {activeCount}
                            </span>
                        )}
                    </div>

                    <div>
                        <h2 className="font-display text-xl font-semibold leading-none text-primary">
                            {isArabic ? "تصفية المنتجات" : "Filters"}
                        </h2>

                        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">
                            {isArabic
                                ? "تصفح حسب تفضيلاتك"
                                : "Refine your selection"}
                        </p>
                    </div>
                </div>

                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.15em] text-primary underline-offset-4 transition-opacity hover:underline"
                    >
                        {isArabic ? "مسح" : "Clear"}
                    </button>
                )}
            </div>

            {/* Categories */}
            <Collapsible defaultOpen>
                <div className="border-t border-ink/10 py-5">
                    <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between text-start outline-none">
                        <h3 className={sectionTitle}>
                            {isArabic ? "الفئات" : "Categories"}
                        </h3>

                        <ChevronDown className="size-4 text-ink/45 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="mt-4 max-h-72 space-y-1 overflow-y-auto pe-1">
                            {categoriesLoading ? (
                                <div className="space-y-1">
                                    <div className="h-11 animate-pulse bg-ink/10" />
                                    <div className="h-11 animate-pulse bg-ink/10" />
                                    <div className="h-11 animate-pulse bg-ink/10" />
                                </div>
                            ) : categories.length > 0 ? (
                                categories.map((category, index) => {
                                    const isActive =
                                        activeSlug === category.slug;

                                    return (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() =>
                                                goTo(
                                                    `/category/${category.slug}`,
                                                )
                                            }
                                            className={`group flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 text-start text-sm transition-colors ${
                                                isActive
                                                    ? "bg-primary text-cream"
                                                    : "text-ink/75 hover:bg-primary/5 hover:text-primary"
                                            }`}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className={`text-[10px] font-semibold tracking-[0.12em] ${
                                                        isActive
                                                            ? "text-cream/60"
                                                            : "text-ink/35"
                                                    }`}
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>

                                                <span className="truncate font-medium">
                                                    {category.name?.[language]}
                                                </span>
                                            </span>

                                            <span
                                                className={`text-[10px] font-semibold ${
                                                    isActive
                                                        ? "text-cream/80"
                                                        : "text-ink/40"
                                                }`}
                                            >
                                                {category.cakeCount ?? 0}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="px-3 py-2 text-xs text-ink/60">
                                    {isArabic
                                        ? "لا توجد فئات"
                                        : "No categories found"}
                                </p>
                            )}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Price */}
            <Collapsible defaultOpen>
                <div className="border-t border-ink/10 py-5">
                    <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between text-start outline-none">
                        <h3 className={sectionTitle}>
                            {isArabic ? "السعر" : "Price"}
                        </h3>

                        <ChevronDown className="size-4 text-ink/45 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 pt-4">
                            {priceRanges.map((range) => {
                                const isSelected =
                                    filters.price === range.value;

                                return (
                                    <button
                                        key={range.value}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            handlePriceChange(range.value)
                                        }
                                        className={`cursor-pointer border px-2 py-3 text-center text-xs font-semibold transition-colors ${
                                            isSelected
                                                ? "border-primary bg-primary text-cream"
                                                : "border-ink/15 text-ink/75 hover:border-primary hover:text-primary"
                                        }`}
                                    >
                                        {range.label[language]}
                                    </button>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Size */}
            <Collapsible defaultOpen>
                <div className="border-t border-ink/10 pt-5">
                    <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between text-start outline-none">
                        <h3 className={sectionTitle}>
                            {isArabic ? "الحجم" : "Size"}
                        </h3>

                        <ChevronDown className="size-4 text-ink/45 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 pt-4">
                            {sizes.map((size) => {
                                const isSelected = filters.size?.includes(
                                    size.value,
                                );

                                return (
                                    <button
                                        key={size.value}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            handleSizeChange(size.value)
                                        }
                                        className={`flex cursor-pointer flex-col items-start gap-1.5 border p-3 text-start transition-colors ${
                                            isSelected
                                                ? "border-primary bg-primary text-cream"
                                                : "border-ink/15 text-ink hover:border-primary hover:text-primary"
                                        }`}
                                    >
                                        <span className="font-display text-lg font-semibold leading-none">
                                            {size.label[language]}
                                        </span>

                                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] opacity-65">
                                            {size.hint[language]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>
    );
};

export default ProductFilters;