import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Check, Loader2, Minus, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";

const formatPrice = (price) => `${Number(price).toFixed(3)} KWD`;

const ProductAddOns = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const { isAuthenticated, user } = useAuth();

    const isCustomer = isAuthenticated && user?.role === "user";

    const {
        data: addOnsResponse,
        isLoading,
        isError,
    } = useGet({
        url: "/add-ons",
        queryKey: ["add-ons"],
        retry: false,
    });

    const { data: cartResponse, refetch: refetchCart } = useGet({
        url: "/cart",
        queryKey: ["cart"],
        enabled: isCustomer,
        retry: false,
    });

    const addOns = useMemo(() => {
        const apiAddOns = addOnsResponse?.data ?? [];

        return apiAddOns
            .filter((addOn) => addOn.isActive)
            .map((addOn) => ({
                id: addOn._id,
                name: addOn.name,
                image: addOn.imageUrl,
                price: Number(addOn.price ?? 0),
            }));
    }, [addOnsResponse]);

    const addOnCartMap = useMemo(() => {
        const apiAddOns = cartResponse?.data?.addOns ?? [];

        return new Map(
            apiAddOns
                .filter((item) => item.addOn)
                .map((item) => [item.addOn._id, item.quantity]),
        );
    }, [cartResponse]);

    const handleUpdated = async () => {
        await refetchCart();
    };

    if (isLoading || isError || addOns.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-ink/10 bg-cream py-10 md:py-14">
            <div className="wrapper">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="size-4" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.17em]">
                                {isArabic
                                    ? "أكمل احتفالك"
                                    : "Complete the celebration"}
                            </span>
                        </div>

                        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
                            {isArabic
                                ? "اجعل كعكتك أكثر تميزًا"
                                : "Make your cake extra special"}
                        </h2>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-ink/60 md:text-right">
                        {isArabic
                            ? "أضف شموعًا أو بطاقة تهنئة أو زهورًا جميلة مع كعكتك."
                            : "Add candles, a greeting card, flowers, or another little extra to make your cake special."}
                    </p>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                    {addOns.map((addOn) => (
                        <FeaturedAddOn
                            key={addOn.id}
                            addOn={addOn}
                            language={language}
                            selected={addOnCartMap.has(addOn.id)}
                            quantity={addOnCartMap.get(addOn.id) ?? 0}
                            onUpdated={handleUpdated}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SelectionIndicator = ({ selected }) => {
    return (
        <div
            aria-hidden="true"
            className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all ${
                selected
                    ? "border-primary bg-primary text-cream"
                    : "border-ink/20 bg-cream/95 text-transparent"
            }`}
        >
            {selected && <Check className="size-3.5" />}
        </div>
    );
};

const QuantityControl = ({
    quantity,
    maximumQuantity = 50,
    onIncrease,
    onDecrease,
    disabled = false,
    compact = false,
    allowZero = false,
}) => {
    const minimumQuantity = allowZero ? 0 : 1;

    return (
        <div
            className={`flex w-fit shrink-0 items-center border border-ink/15 bg-cream ${
                compact ? "h-9" : "h-10"
            } ${disabled ? "opacity-50" : ""}`}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={
                    disabled ||
                    quantity <= minimumQuantity ||
                    maximumQuantity < 1
                }
                onClick={onDecrease}
                className={`${compact ? "size-8" : "size-9"} rounded-none text-ink hover:bg-blush hover:text-primary`}
            >
                <Minus className="size-3" />
            </Button>

            <span
                dir="ltr"
                className={`text-center font-bold text-ink ${
                    compact ? "w-6 text-xs" : "w-8 text-sm"
                }`}
            >
                {quantity}
            </span>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || quantity >= maximumQuantity}
                onClick={onIncrease}
                className={`${compact ? "size-8" : "size-9"} rounded-none text-ink hover:bg-blush hover:text-primary`}
            >
                <Plus className="size-3" />
            </Button>
        </div>
    );
};

const FeaturedAddOn = ({
    addOn,
    language,
    selected,
    quantity,
    onUpdated,
}) => {
    const isArabic = language === "ar";
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const { mutate: addCartAddOn, isPending: isAdding } = usePost({
        url: "/cart/add-ons",
    });

    const { mutate: updateCartAddOn, isPending: isUpdating } = usePatch({
        url: `/cart/add-ons/${addOn.id}`,
    });

    const { mutate: removeCartAddOn, isPending: isRemoving } = useDelete({
        url: `/cart/add-ons/${addOn.id}`,
    });

    const isPending = isAdding || isUpdating || isRemoving;

    const handleAdd = () => {
        if (isPending || selected) {
            return;
        }

        if (!isAuthenticated) {
            toast.error(
                isArabic
                    ? "يرجى تسجيل الدخول لإضافة الإضافات إلى السلة"
                    : "Please log in to add add-ons to your cart",
            );

            navigate("/auth/login", {
                replace: true,
                state: { from: location },
            });

            return;
        }

        if (user?.role !== "user") {
            toast.error(
                isArabic
                    ? "التسوق متاح لحسابات العملاء فقط"
                    : "Shopping is available for customer accounts only",
            );

            return;
        }

        addCartAddOn(
            {
                addOnId: addOn.id,
                quantity: 1,
            },
            {
                onSuccess: async () => {
                    toast.success(
                        isArabic
                            ? "تمت إضافة الإضافة إلى السلة"
                            : "Add-on added to cart",
                    );

                    await onUpdated();
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message ||
                            (isArabic
                                ? "تعذر إضافة الإضافة"
                                : "Unable to add add-on"),
                    );
                },
            },
        );
    };

    const handleIncrease = () => {
        if (isPending) {
            return;
        }

        if (!selected) {
            handleAdd();
            return;
        }

        if (quantity >= 50) {
            return;
        }

        updateCartAddOn(
            {
                quantity: quantity + 1,
            },
            {
                onSuccess: async () => {
                    await onUpdated();
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message ||
                            (isArabic
                                ? "تعذر تحديث كمية الإضافة"
                                : "Unable to update add-on quantity"),
                    );
                },
            },
        );
    };

    const handleDecrease = () => {
        if (isPending || !selected) {
            return;
        }

        if (quantity > 1) {
            updateCartAddOn(
                {
                    quantity: quantity - 1,
                },
                {
                    onSuccess: async () => {
                        await onUpdated();
                    },
                    onError: (error) => {
                        toast.error(
                            error?.response?.data?.message ||
                                (isArabic
                                    ? "تعذر تحديث كمية الإضافة"
                                    : "Unable to update add-on quantity"),
                        );
                    },
                },
            );

            return;
        }

        removeCartAddOn(undefined, {
            onSuccess: async () => {
                toast.success(
                    isArabic ? "تمت إزالة الإضافة" : "Add-on removed",
                );

                await onUpdated();
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message ||
                        (isArabic
                            ? "تعذر إزالة الإضافة"
                            : "Unable to remove add-on"),
                );
            },
        });
    };

    return (
        <article
            className={`group min-w-0 overflow-hidden rounded-[14px] border transition-colors duration-300 ${
                selected
                    ? "border-primary/50 bg-blush/60"
                    : "border-ink/10 bg-white/60 hover:border-primary/30"
            }`}
        >
            <div className="relative aspect-[1.35] overflow-hidden bg-blush">
                <img
                    src={addOn.image}
                    alt={addOn.name[language]}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent"
                />

                <div className="absolute inset-s-3 top-3">
                    <SelectionIndicator selected={selected} />
                </div>

                {selected && (
                    <span className="absolute inset-e-3 top-3 bg-primary px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-cream">
                        {isArabic ? "تم الاختيار" : "Added"}
                    </span>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <h3
                    title={addOn.name[language]}
                    className="truncate font-display text-sm font-semibold text-ink sm:text-base"
                >
                    {addOn.name[language]}
                </h3>

                <p
                    dir="ltr"
                    className="mt-1.5 text-sm font-bold text-primary"
                >
                    +{formatPrice(addOn.price)}
                </p>

                <div className="mt-4 border-t border-ink/10 pt-3">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                            {isArabic ? "الكمية" : "Quantity"}
                        </span>

                        {selected && (
                            <span className="text-[10px] font-bold text-primary">
                                {isArabic ? "في السلة" : "In cart"}
                            </span>
                        )}
                    </div>

                    {isPending ? (
                        <div className="flex h-9 w-[104px] items-center justify-center border border-ink/15 bg-cream">
                            <Loader2 className="size-4 animate-spin text-primary" />
                        </div>
                    ) : (
                        <QuantityControl
                            quantity={selected ? quantity : 0}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            maximumQuantity={50}
                            allowZero
                            compact
                        />
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductAddOns;