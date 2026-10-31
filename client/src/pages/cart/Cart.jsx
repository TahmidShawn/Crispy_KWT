
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Flame,
    Loader2,
    Minus,
    Plus,
    ShoppingBag,
    Sparkles,
    Trash2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const formatPrice = (price) => `${Number(price).toFixed(3)} KWD`;

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1713774788222-78dde5aa19ff?auto=format&fit=crop&w=2000&q=80";

const eyebrowText =
    "text-[10px] font-semibold uppercase tracking-[0.17em] text-ink";

const outlineButton =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-ink/25 bg-transparent px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-40";

const solidButton =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 bg-primary px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-ink disabled:pointer-events-none disabled:opacity-40";

const Cart = () => {
    const { language } = useLanguage();
    const isArabic = language === "ar";
    const navigate = useNavigate();

    const {
        data: cartResponse,
        isLoading: isCartLoading,
        isError: isCartError,
        refetch: refetchCart,
    } = useGet({
        url: "/cart",
        queryKey: ["cart"],
        retry: false,
    });

    const {
        data: addOnsResponse,
        isLoading: isAddOnsLoading,
        isError: isAddOnsError,
        refetch: refetchAddOns,
    } = useGet({
        url: "/add-ons",
        queryKey: ["add-ons"],
        retry: false,
    });

    const cartData = cartResponse?.data;

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

    const cartAddOns = useMemo(() => {
        const apiAddOns = cartData?.addOns ?? [];

        return apiAddOns
            .filter((item) => item.addOn)
            .map((item) => ({
                id: item.addOn._id,
                quantity: item.quantity,
            }));
    }, [cartData]);

    const addOnCartMap = useMemo(() => {
        return new Map(cartAddOns.map((item) => [item.id, item.quantity]));
    }, [cartAddOns]);

    const selectedAddOnItems = useMemo(() => {
        return addOns
            .filter((addOn) => addOnCartMap.has(addOn.id))
            .map((addOn) => ({
                ...addOn,
                quantity: addOnCartMap.get(addOn.id),
            }));
    }, [addOns, addOnCartMap]);

    const cartItems = useMemo(() => {
        const apiItems = cartData?.items ?? [];

        return apiItems
            .map((item) => {
                const cake = item.cake;

                if (!cake) {
                    return null;
                }

                const price = Number(cake.price ?? 0);
                const discountPercentage = Number(
                    cake.discountPercentage ?? 0,
                );

                const discountedPrice = Number(
                    cake.discountedPrice ??
                        (price - (price * discountPercentage) / 100).toFixed(3),
                );

                const image =
                    typeof cake.images?.[0] === "string"
                        ? cake.images[0]
                        : cake.images?.[0]?.url;

                return {
                    id: cake._id,
                    name: cake.name,
                    image,
                    size: cake.size ?? {
                        en: "",
                        ar: "",
                    },
                    weightSize: cake.weightSize,
                    servings: cake.servings ?? "",
                    price,
                    discountPercentage,
                    discountedPrice,
                    quantity: item.quantity,
                    stock: cake.stock,
                    isActive: cake.isActive,
                    slug: cake.slug,
                };
            })
            .filter(Boolean);
    }, [cartData]);

    const [selectedItems, setSelectedItems] = useState(null);

    const selectedItemIds =
        selectedItems === null
            ? cartItems.map((item) => item.id)
            : selectedItems.filter((id) =>
                  cartItems.some((item) => item.id === id),
              );

    const selectedCartItems = cartItems.filter((item) =>
        selectedItemIds.includes(item.id),
    );

    const totalCakeItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const totalAddOnItems = selectedAddOnItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const totalItems = totalCakeItems + totalAddOnItems;

    const selectedCakesCount = selectedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const selectedAddOnsCount = selectedAddOnItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const selectedItemsCount = selectedCakesCount + selectedAddOnsCount;

    const cakesTotal = selectedCartItems.reduce(
        (total, item) => total + item.discountedPrice * item.quantity,
        0,
    );

    const cakesOriginalTotal = selectedCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const addOnsTotal = selectedAddOnItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const subtotal = cakesTotal + addOnsTotal;
    const discount = Math.max(0, cakesOriginalTotal - cakesTotal);

    const deliveryFee = 0;
    const total = subtotal + deliveryFee;

    const toggleItem = (id) => {
        setSelectedItems((current) => {
            const selected = current ?? cartItems.map((item) => item.id);

            return selected.includes(id)
                ? selected.filter((itemId) => itemId !== id)
                : [...selected, id];
        });
    };

    const toggleAllItems = () => {
        setSelectedItems((current) => {
            const selected = current ?? cartItems.map((item) => item.id);

            if (selected.length === cartItems.length) {
                return [];
            }

            return cartItems.map((item) => item.id);
        });
    };

    const scrollToAddOns = () => {
        document.getElementById("cart-add-ons")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const proceedToCheckout = () => {
        if (selectedItemIds.length === 0) {
            return;
        }

        navigate("/checkout", {
            state: {
                cakeIds: selectedItemIds,
            },
        });
    };

    if (isCartLoading || isAddOnsLoading) {
        return (
            <main className="bg-cream pb-16 md:pb-0">
                <section className="py-24 md:py-32">
                    <div className="wrapper">
                        <div className="flex min-h-[400px] items-center justify-center">
                            <ShoppingBag className="size-8 animate-pulse text-primary" />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (isCartError || isAddOnsError) {
        return (
            <main className="bg-cream pb-16 md:pb-0">
                <section className="py-24 md:py-32">
                    <div className="wrapper">
                        <div className="mx-auto flex max-w-md flex-col items-center rounded-[14px] border border-ink/10 bg-white px-6 py-14 text-center">
                            <div className="grid size-14 place-items-center bg-primary text-cream">
                                <ShoppingBag className="size-6" />
                            </div>

                            <h2 className="mt-5 font-display text-2xl font-semibold text-primary">
                                {isArabic
                                    ? "تعذر تحميل السلة"
                                    : "Unable to load your cart"}
                            </h2>

                            <button
                                type="button"
                                className={`${solidButton} mt-6`}
                                onClick={() => {
                                    if (isCartError) refetchCart();
                                    if (isAddOnsError) refetchAddOns();
                                }}
                            >
                                {isArabic ? "حاول مرة أخرى" : "Try again"}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-cream pb-16 md:pb-0">
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-ink text-cream">
                <img
                    src={HERO_IMAGE}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 -z-20 size-full object-cover object-center"
                />

                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(59,32,38,0.62)_0%,rgba(59,32,38,0.93)_100%)]" />

                <div className="wrapper py-7 md:py-10">
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

                        <span className="text-cream">
                            {isArabic ? "السلة" : "Cart"}
                        </span>
                    </nav>

                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.045em] text-cream md:text-4xl">
                                {isArabic ? "سلتك" : "Your cart"}
                            </h1>

                            <p className="mt-2.5 max-w-md text-xs leading-relaxed text-cream/75 md:text-sm">
                                {isArabic
                                    ? "راجع طلبك وأضف لمساتك الخاصة قبل المتابعة."
                                    : "Review your order and add something special before checkout."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <span className="font-display text-4xl font-semibold leading-none text-cream md:text-5xl">
                                {String(totalItems).padStart(2, "0")}
                            </span>

                            <div className="flex flex-col gap-0.5 border-s border-cream/25 ps-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.15em]">
                                <span className="text-cream">
                                    {isArabic ? "منتجات" : "Items"}
                                </span>

                                <span className="text-cream/50">
                                    {isArabic ? "في سلتك" : "in your cart"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listing */}
            <section className="relative overflow-hidden py-10 md:py-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 end-0 size-96 rounded-full bg-blush/40 blur-3xl"
                />

                <div className="wrapper relative">
                    {/* Add-ons promo */}
                    <div className="mb-8 flex flex-col gap-4 rounded-[14px] border border-ink/10 bg-white/60 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                        <div className="flex items-start gap-3">
                            <div className="grid size-10 shrink-0 rounded-lg place-items-center bg-primary text-cream">
                                <Sparkles className="size-4" />
                            </div>

                            <div>
                                <h2 className="font-display text-lg font-semibold text-primary md:text-xl">
                                    {isArabic
                                        ? "اجعل احتفالك أكثر تميزًا"
                                        : "Make your celebration extra special"}
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-ink/70">
                                    {isArabic
                                        ? "أضف شموعًا أو زهورًا أو بطاقة تهنئة مع كعكتك."
                                        : "Add candles, flowers, a greeting card, or a little extra with your cake."}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className={`${solidButton} shrink-0 hover:bg-primary/70 `}
                            onClick={scrollToAddOns}
                        >
                            {isArabic
                                ? "اكتشف الإضافات"
                                : "Explore add-ons"}

                            <ArrowRight className="size-4 rtl:rotate-180" />
                        </Button>
                    </div>

                    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
                        <div className="min-w-0 flex-1">
                            {/* Select all */}
                            <div className="mb-4 flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="select-all"
                                        checked={
                                            cartItems.length > 0 &&
                                            selectedItemIds.length ===
                                                cartItems.length
                                        }
                                        onCheckedChange={toggleAllItems}
                                    />

                                    <label
                                        htmlFor="select-all"
                                        className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.15em] text-ink"
                                    >
                                        {isArabic ? "تحديد الكل" : "Select all"}
                                    </label>
                                </div>

                                <span className="bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                                    {selectedItemsCount}{" "}
                                    {isArabic ? "محدد" : "selected"}
                                </span>
                            </div>

                            {/* Cart items */}
                            {cartItems.length > 0 ? (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            language={language}
                                            selected={selectedItemIds.includes(
                                                item.id,
                                            )}
                                            onToggle={() =>
                                                toggleItem(item.id)
                                            }
                                            onUpdated={refetchCart}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-[14px] border border-ink/10 bg-white/60 px-6 py-16 text-center">
                                    <div className="mx-auto mb-5 grid size-14 rounded-lg place-items-center bg-primary text-cream">
                                        <ShoppingBag className="size-6" />
                                    </div>

                                    <h2 className="font-display text-2xl font-semibold text-primary">
                                        {isArabic
                                            ? "سلة التسوق فارغة"
                                            : "Your cart is empty"}
                                    </h2>

                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                                        {isArabic
                                            ? "أضف كعكة للبدء."
                                            : "Add a cake to get started."}
                                    </p>
                                </div>
                            )}

                            {/* Add-ons */}
                            <div
                                id="cart-add-ons"
                                className="mt-12 scroll-mt-24 border-t border-ink/10 pt-10"
                            >
                                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                                    <div className="max-w-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="h-px w-8 bg-primary" />

                                            <span className={eyebrowText}>
                                                {isArabic
                                                    ? "أكمل احتفالك"
                                                    : "Complete the celebration"}
                                            </span>
                                        </div>

                                        <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] text-primary md:text-4xl">
                                            {isArabic
                                                ? "اجعل كعكتك أكثر تميزًا"
                                                : "Make your cake extra special"}
                                        </h2>

                                        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                                            {isArabic
                                                ? "أضف شموعًا أو بطاقة تهنئة أو زهورًا جميلة مع طلبك."
                                                : "Add candles, a greeting card, flowers, or another little extra to make your celebration memorable."}
                                        </p>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger
                                            render={
                                                <Button
                                                    type="button"
                                                    className={`${outlineButton} shrink-0 text-blush bg-primary hover:bg-primary/70`}
                                                />
                                            }
                                        >
                                            <Sparkles className="size-4" />

                                            {isArabic
                                                ? "عرض جميع الإضافات"
                                                : `See all ${addOns.length} add-ons`}

                                            <ChevronRight className="size-4 rtl:rotate-180" />
                                        </DialogTrigger>

                                        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] !max-w-[70vw] overflow-y-auto rounded-[14px] border border-ink/10 bg-cream p-5 md:p-6">
                                            <DialogHeader className="mb-2">
                                                <DialogTitle className="font-display text-2xl font-semibold text-primary">
                                                    {isArabic
                                                        ? "اجعل طلبك مميزًا"
                                                        : "Make your order special"}
                                                </DialogTitle>
                                            </DialogHeader>

                                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                                {addOns.map((addOn) => (
                                                    <AddOnCard
                                                        key={addOn.id}
                                                        addOn={addOn}
                                                        language={language}
                                                        selected={addOnCartMap.has(
                                                            addOn.id,
                                                        )}
                                                        quantity={
                                                            addOnCartMap.get(
                                                                addOn.id,
                                                            ) ?? 0
                                                        }
                                                        onUpdated={refetchCart}
                                                    />
                                                ))}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 md:gap-[18px] lg:grid-cols-3">
                                    {addOns.slice(0, 6).map((addOn) => (
                                        <FeaturedAddOn
                                            key={addOn.id}
                                            addOn={addOn}
                                            language={language}
                                            selected={addOnCartMap.has(
                                                addOn.id,
                                            )}
                                            quantity={
                                                addOnCartMap.get(addOn.id) ?? 0
                                            }
                                            onUpdated={refetchCart}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <aside className="w-full xl:w-[360px]">
                            <div className="overflow-hidden rounded-[14px] border border-ink/10 bg-white shadow-lg shadow-ink/5 xl:sticky xl:top-24">
                                {/* Single-color header */}
                                <div className="flex items-center justify-between gap-3 bg-primary px-5 py-5 text-cream md:px-6">
                                    <div>
                                        <h2 className="font-display text-xl font-semibold tracking-tight">
                                            {isArabic
                                                ? "ملخص الطلب"
                                                : "Order summary"}
                                        </h2>

                                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.13em] text-cream/70">
                                            {isArabic
                                                ? "تفاصيل طلبك"
                                                : "Your order details"}
                                        </p>
                                    </div>

                                    {selectedItemsCount > 0 && (
                                        <span className="border border-cream/30 bg-cream/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream">
                                            {selectedItemsCount}{" "}
                                            {isArabic
                                                ? "عنصر"
                                                : selectedItemsCount === 1
                                                  ? "item"
                                                  : "items"}
                                        </span>
                                    )}
                                </div>

                                <div className="p-5 md:p-6">
                                    {selectedItemsCount === 0 ? (
                                        <div className="py-7 text-center">
                                            <div className="mx-auto grid size-14 place-items-center border border-ink/10 bg-cream text-primary">
                                                <ShoppingBag className="size-6" />
                                            </div>

                                            <p className="mt-4 font-display text-lg font-semibold text-ink">
                                                {isArabic
                                                    ? "لم تحدد أي عنصر بعد"
                                                    : "No items selected yet"}
                                            </p>

                                            <p className="mx-auto mt-1 max-w-[220px] text-xs leading-relaxed text-ink/55">
                                                {isArabic
                                                    ? "حدد عنصرًا لرؤية تفاصيل الأسعار."
                                                    : "Select an item to see your price breakdown."}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-5">
                                                {selectedCartItems.length > 0 && (
                                                    <div>
                                                        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                                                            {isArabic
                                                                ? "الكعكات"
                                                                : "Cakes"}
                                                        </p>

                                                        <div className="space-y-2">
                                                            {selectedCartItems.map(
                                                                (item) => (
                                                                    <SummaryItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        image={
                                                                            item.image
                                                                        }
                                                                        name={
                                                                            item
                                                                                .name[
                                                                                language
                                                                            ]
                                                                        }
                                                                        quantity={
                                                                            item.quantity
                                                                        }
                                                                        unitPrice={
                                                                            item.discountedPrice
                                                                        }
                                                                        originalPrice={
                                                                            item.price
                                                                        }
                                                                        discountPercentage={
                                                                            item.discountPercentage
                                                                        }
                                                                        lineTotal={
                                                                            item.discountedPrice *
                                                                            item.quantity
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedAddOnItems.length > 0 && (
                                                    <div>
                                                        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                                                            {isArabic
                                                                ? "الإضافات"
                                                                : "Add-ons"}
                                                        </p>

                                                        <div className="space-y-2">
                                                            {selectedAddOnItems.map(
                                                                (addOn) => (
                                                                    <SummaryItem
                                                                        key={
                                                                            addOn.id
                                                                        }
                                                                        image={
                                                                            addOn.image
                                                                        }
                                                                        name={
                                                                            addOn
                                                                                .name[
                                                                                language
                                                                            ]
                                                                        }
                                                                        quantity={
                                                                            addOn.quantity
                                                                        }
                                                                        unitPrice={
                                                                            addOn.price
                                                                        }
                                                                        lineTotal={
                                                                            addOn.price *
                                                                            addOn.quantity
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="my-5 border-t border-dashed border-ink/15" />

                                            <div className="space-y-3 text-sm">
                                                {selectedCartItems.length > 0 && (
                                                    <SummaryRow
                                                        label={
                                                            isArabic
                                                                ? "الكعكات"
                                                                : "Cakes"
                                                        }
                                                        hint={`${selectedCakesCount} ${
                                                            isArabic
                                                                ? "قطعة"
                                                                : "pcs"
                                                        }`}
                                                        value={cakesTotal}
                                                    />
                                                )}

                                                {selectedAddOnItems.length > 0 && (
                                                    <SummaryRow
                                                        label={
                                                            isArabic
                                                                ? "الإضافات"
                                                                : "Add-ons"
                                                        }
                                                        hint={`${selectedAddOnsCount} ${
                                                            isArabic
                                                                ? "قطعة"
                                                                : "pcs"
                                                        }`}
                                                        value={addOnsTotal}
                                                    />
                                                )}

                                                <SummaryRow
                                                    label={
                                                        isArabic
                                                            ? "التوصيل"
                                                            : "Delivery"
                                                    }
                                                    value={deliveryFee}
                                                    free={deliveryFee === 0}
                                                    isArabic={isArabic}
                                                />
                                            </div>

                                            {discount > 0 && (
                                                <div className="mt-4 flex items-center justify-between gap-3 border border-primary/15 bg-primary/[0.04] px-3 py-3">
                                                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
                                                        <Flame className="size-4" />

                                                        {isArabic
                                                            ? "إجمالي ما وفرته"
                                                            : "Total savings"}
                                                    </div>

                                                    <span
                                                        dir="ltr"
                                                        className="text-sm font-bold text-primary"
                                                    >
                                                        {formatPrice(discount)}
                                                    </span>
                                                </div>
                                            )}

                                            {deliveryFee === 0 && (
                                                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                                                    <Check className="size-3.5" />

                                                    {isArabic
                                                        ? "لقد حصلت على توصيل مجاني."
                                                        : "You've unlocked free delivery."}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    <div className="my-5 border-t border-ink/10" />

                                    {/* Total */}
                                    <div className="rounded-[10px] bg-cream p-4">
                                        <div className="flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-ink/70">
                                                    {isArabic
                                                        ? "الإجمالي"
                                                        : "Total"}
                                                </p>

                                                <p className="mt-1 text-[11px] text-ink/55">
                                                    {isArabic
                                                        ? "شامل التوصيل"
                                                        : "Including delivery"}
                                                </p>
                                            </div>

                                            <span
                                                dir="ltr"
                                                className="font-display text-[26px] font-semibold leading-none tracking-[-0.04em] text-primary"
                                            >
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        disabled={selectedItemIds.length === 0}
                                        className="mt-4 rounded-lg inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
                                        onClick={proceedToCheckout}
                                    >
                                        {isArabic
                                            ? "متابعة الدفع"
                                            : "Proceed to checkout"}

                                        <ArrowRight className="size-4 rtl:rotate-180" />
                                    </button>

                                    {selectedItemIds.length === 0 && (
                                        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/50">
                                            {isArabic
                                                ? "حدد عنصرًا واحدًا على الأقل للمتابعة."
                                                : "Select at least one item to continue."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
};

const CartItem = ({ item, language, selected, onToggle, onUpdated }) => {
    const isArabic = language === "ar";

    const { mutate: updateCartItem, isPending: isUpdating } = usePatch({
        url: `/cart/items/${item.id}`,
    });

    const { mutate: deleteCartItem, isPending: isRemoving } = useDelete({
        url: `/cart/items/${item.id}`,
    });

    const handleQuantityChange = (quantity) => {
        const maxQuantity = Math.min(50, Number(item.stock ?? 50));

        if (quantity < 1 || quantity > maxQuantity) {
            return;
        }

        updateCartItem(
            { quantity },
            {
                onSuccess: async () => {
                    await onUpdated();
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message ||
                            (isArabic
                                ? "تعذر تحديث كمية الكعكة"
                                : "Unable to update cart item"),
                    );
                },
            },
        );
    };

    const handleRemove = () => {
        if (isUpdating || isRemoving) return;

        deleteCartItem(undefined, {
            onSuccess: async () => {
                toast.success(
                    isArabic
                        ? "تمت إزالة الكعكة من السلة"
                        : "Cake removed from cart",
                );

                await onUpdated();
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message ||
                        (isArabic
                            ? "تعذر إزالة الكعكة من السلة"
                            : "Unable to remove cart item"),
                );
            },
        });
    };

    const maxQuantity = Math.min(50, Number(item.stock ?? 50));
    const lineTotal = item.discountedPrice * item.quantity;
    const savingsPerItem = Math.max(0, item.price - item.discountedPrice);
    const totalSavings = savingsPerItem * item.quantity;
    const hasDiscount = item.discountPercentage > 0 && savingsPerItem > 0;

    return (
        <div
            className={`rounded-[14px] border p-3 transition-all sm:p-4 md:p-5 ${
                selected
                    ? "border-primary/30 bg-white hover:shadow-lg hover:shadow-ink/5"
                    : "border-ink/10 bg-white/60 opacity-60"
            }`}
        >
            <div className="flex gap-2.5 sm:gap-3 md:gap-4">
                <div className="flex shrink-0 items-start pt-1">
                    <Checkbox
                        checked={selected}
                        disabled={isUpdating || isRemoving}
                        onCheckedChange={onToggle}
                    />
                </div>

                <div className="size-20 shrink-0 overflow-hidden rounded-[10px] bg-blush/50 sm:size-24 md:size-28">
                    <img
                        src={item.image}
                        alt={item.name?.[language] || ""}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="min-w-0">
                            <p className="w-fit border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[10px]">
                                {item.weightSize}
                            </p>

                            <h2 className="mt-2 line-clamp-2 font-display text-base font-semibold leading-tight text-ink sm:text-lg md:text-xl">
                                {item.name?.[language]}
                            </h2>

                            <p className="mt-1 text-[11px] text-ink/60 sm:text-xs">
                                {isArabic
                                    ? `${item.servings} حصص`
                                    : `${item.servings} servings`}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={isUpdating || isRemoving}
                            onClick={handleRemove}
                            aria-label={isArabic ? "إزالة" : "Remove"}
                            className="grid size-8 shrink-0 cursor-pointer place-items-center border border-ink/20 text-ink/60 transition-colors hover:border-ink hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-40"
                        >
                            {isRemoving ? (
                                <Loader2 className="size-3.5 animate-spin sm:size-4" />
                            ) : (
                                <Trash2 className="size-3.5 sm:size-4" />
                            )}
                        </button>
                    </div>

                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span
                                    dir="ltr"
                                    className="text-xs font-bold text-primary sm:text-sm"
                                >
                                    {formatPrice(item.discountedPrice)}
                                </span>

                                {hasDiscount && (
                                    <>
                                        <span
                                            dir="ltr"
                                            className="text-[10px] text-ink/50 line-through sm:text-xs"
                                        >
                                            {formatPrice(item.price)}
                                        </span>

                                        <span className="bg-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-cream sm:text-[10px]">
                                            -{item.discountPercentage}%
                                        </span>
                                    </>
                                )}

                                <span className="text-[10px] font-semibold text-ink/50">
                                    × {item.quantity}
                                </span>
                            </div>

                            <div className="mt-1.5 flex items-baseline gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                                    {isArabic
                                        ? "إجمالي المنتج"
                                        : "Item total"}
                                </span>

                                <span
                                    dir="ltr"
                                    className="font-display text-lg font-semibold text-ink sm:text-xl"
                                >
                                    {formatPrice(lineTotal)}
                                </span>
                            </div>

                            {hasDiscount && totalSavings > 0 && (
                                <p className="mt-1 text-[10px] font-semibold text-primary sm:text-[11px]">
                                    {isArabic
                                        ? `وفرت ${formatPrice(totalSavings)}`
                                        : `You save ${formatPrice(totalSavings)}`}
                                </p>
                            )}
                        </div>

                        {isUpdating ? (
                            <div className="flex h-9 w-26 shrink-0 items-center justify-center border border-ink/20 bg-white">
                                <Loader2 className="size-4 animate-spin text-primary" />
                            </div>
                        ) : (
                            <QuantityControl
                                quantity={item.quantity}
                                maximumQuantity={maxQuantity}
                                onIncrease={() =>
                                    handleQuantityChange(item.quantity + 1)
                                }
                                onDecrease={() =>
                                    handleQuantityChange(item.quantity - 1)
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
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
        if (isPending || selected) return;

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
        if (isPending) return;

        if (!selected) {
            handleAdd();
            return;
        }

        if (quantity >= 50) return;

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
        if (isPending || !selected) return;

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
        <div
            className={`min-w-0 overflow-hidden rounded-[14px] border transition-all ${
                selected
                    ? "border-primary/30 bg-primary/5 shadow-lg shadow-ink/5"
                    : "border-ink/10 bg-white"
            }`}
        >
            <div className="relative aspect-[1.45] overflow-hidden bg-blush/50">
                <img
                    src={addOn.image}
                    alt={addOn.name[language]}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-s-2 top-2 sm:inset-s-3 sm:top-3">
                    <SelectionIndicator selected={selected} />
                </div>
            </div>

            <div className="p-3 md:p-4">
                <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-semibold text-ink md:text-lg">
                        {addOn.name[language]}
                    </h3>

                    <p
                        dir="ltr"
                        className="mt-1 text-xs font-bold text-primary sm:text-sm"
                    >
                        +{formatPrice(addOn.price)}
                    </p>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3 sm:mt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">
                        {isArabic ? "الكمية" : "Quantity"}
                    </span>

                    {isPending ? (
                        <div className="flex h-8 w-23 items-center justify-center border border-ink/20 bg-white">
                            <Loader2 className="size-3.5 animate-spin text-primary" />
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
        </div>
    );
};

const AddOnCard = ({ addOn, language, selected, quantity, onUpdated }) => {
    const isArabic = language === "ar";

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
        if (isPending || selected) return;

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
        if (isPending) return;

        if (!selected) {
            handleAdd();
            return;
        }

        if (quantity >= 50) return;

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
        if (isPending || !selected) return;

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
        <div
            className={`min-w-0 rounded-[14px] border p-3 transition-all ${
                selected
                    ? "border-primary/30 bg-primary/5"
                    : "border-ink/10 bg-white"
            }`}
        >
            <div className="flex gap-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-[10px] bg-blush/50">
                    <img
                        src={addOn.image}
                        alt={addOn.name[language]}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-display text-base font-semibold leading-tight text-ink">
                                {addOn.name[language]}
                            </h3>
                        </div>

                        <SelectionIndicator selected={selected} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                            dir="ltr"
                            className="text-xs font-bold text-primary"
                        >
                            +{formatPrice(addOn.price)}
                        </span>

                        {isPending ? (
                            <div className="flex h-8 w-23 items-center justify-center border border-ink/20 bg-white">
                                <Loader2 className="size-3.5 animate-spin text-primary" />
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
            </div>
        </div>
    );
};

const SelectionIndicator = ({ selected }) => {
    return (
        <div
            aria-hidden="true"
            className={`grid size-6 shrink-0 place-items-center border transition-colors sm:size-7 ${
                selected
                    ? "border-primary bg-primary text-cream"
                    : "border-ink/25 bg-white"
            }`}
        >
            {selected && <Check className="size-3 sm:size-3.5" />}
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

    const buttonClass = `grid ${
        compact ? "size-8" : "size-9"
    } cursor-pointer place-items-center text-ink transition-colors hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-40`;

    return (
        <div
            className={`flex w-fit shrink-0 items-center border border-ink/20 bg-white ${
                compact ? "h-8" : "h-9"
            } ${disabled ? "opacity-50" : ""}`}
        >
            <button
                type="button"
                disabled={
                    disabled ||
                    quantity <= minimumQuantity ||
                    maximumQuantity < 1
                }
                onClick={onDecrease}
                className={buttonClass}
            >
                <Minus className="size-3" />
            </button>

            <span
                dir="ltr"
                className={`text-center font-semibold text-ink ${
                    compact ? "w-6 text-xs" : "w-8 text-sm"
                }`}
            >
                {quantity}
            </span>

            <button
                type="button"
                disabled={disabled || quantity >= maximumQuantity}
                onClick={onIncrease}
                className={buttonClass}
            >
                <Plus className="size-3" />
            </button>
        </div>
    );
};

const SummaryItem = ({
    image,
    name,
    quantity,
    unitPrice,
    originalPrice,
    discountPercentage,
    lineTotal,
}) => {
    const hasDiscount =
        Number(discountPercentage ?? 0) > 0 &&
        Number(originalPrice ?? 0) > Number(unitPrice ?? 0);

    return (
        <div className="flex items-center gap-3 rounded-[10px] border border-ink/10 bg-cream/70 p-2.5">
            {image && (
                <div className="size-12 shrink-0 overflow-hidden rounded-[8px] bg-blush/50">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-semibold text-ink">
                        {name}
                    </p>

                    <span
                        dir="ltr"
                        className="shrink-0 text-sm font-bold text-primary"
                    >
                        {formatPrice(lineTotal)}
                    </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                        dir="ltr"
                        className="text-[11px] font-semibold text-ink/60"
                    >
                        {formatPrice(unitPrice)} × {quantity}
                    </span>

                    {hasDiscount && (
                        <>
                            <span
                                dir="ltr"
                                className="text-[10px] text-ink/45 line-through"
                            >
                                {formatPrice(originalPrice)}
                            </span>

                            <span className="bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-cream">
                                -{discountPercentage}%
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const SummaryRow = ({
    label,
    value,
    hint,
    free = false,
    discount = false,
    isArabic = false,
}) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <span
                className={`flex items-center gap-1.5 ${
                    discount ? "font-semibold text-primary" : "text-ink/70"
                }`}
            >
                {label}

                {hint && (
                    <span className="text-[11px] font-medium text-ink/45">
                        ({hint})
                    </span>
                )}
            </span>

            {free ? (
                <span className="bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream">
                    {isArabic ? "مجاني" : "Free"}
                </span>
            ) : (
                <span
                    dir="ltr"
                    className={
                        discount
                            ? "font-semibold text-primary"
                            : "font-semibold text-ink"
                    }
                >
                    {discount ? `- ${formatPrice(value)}` : formatPrice(value)}
                </span>
            )}
        </div>
    );
};

export default Cart;
